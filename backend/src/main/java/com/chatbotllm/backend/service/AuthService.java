package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.repositories.UsuarioRepository;
import com.chatbotllm.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public String signup(){
        Usuario usuario = new Usuario();
        usuario.setSubject(hash(Instant.now().toString()));
        usuarioRepository.save(usuario);

        return jwtService.generateToken(usuario);
    }

    public Usuario getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return usuarioRepository.findBySubject(userDetails.getUsername()).
                orElseThrow(() -> new RuntimeException("Usuário #" + userDetails.getUsername() + " não encontrado"));
    }

    private String hash(String subject){
        try {
            // Instancia o algoritmo desejado (SHA-256, MD5, SHA-512, etc.)
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Converte a string para bytes e gera o hash
            byte[] hashBytes = digest.digest(subject.getBytes());

            // Converte o array de bytes para uma representação em String hexadecimal
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if(hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar o hash", e);
        }
    }
}
