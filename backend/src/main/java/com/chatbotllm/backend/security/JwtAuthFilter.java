package com.chatbotllm.backend.security;

import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String subject = jwtService.extractSubject(token);

        if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Token com assinatura válida mas cujo usuário não existe mais (ex.: base
            // recriada ou token antigo) não deve gerar 500: apenas seguimos sem autenticar,
            // e o endpoint protegido responde 401 — permitindo ao cliente renovar o token.
            Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(subject);
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                        .username(usuario.getUsername())
                        .password(usuario.getPassword())
                        .roles()
                        .build();
                if (jwtService.isValid(token, usuario)) {
                    var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
