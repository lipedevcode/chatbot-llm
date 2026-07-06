package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.PerfilUsuarioDto;
import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.data.request.AtualizarPerfilRequest;
import com.chatbotllm.backend.exception.ConflictException;
import com.chatbotllm.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public PerfilUsuarioDto getPerfil() {
        Usuario usuario = this.authService.getAuthenticatedUser();
        return PerfilUsuarioDto.fromUsuario(usuario);
    }

    @Transactional
    public PerfilUsuarioDto atualizarPerfil(AtualizarPerfilRequest atualizarPerfilRequest) {
        Usuario usuario = this.authService.getAuthenticatedUser();

        // Trata string em branco como "não informado" — evita gravar email/nome
        // vazio quando o cliente manda "" em vez de omitir o campo.
        String novoEmail = atualizarPerfilRequest.getEmail();
        if (novoEmail != null && !novoEmail.isBlank() && !novoEmail.equals(usuario.getEmail())) {
            if (this.usuarioRepository.existsUsuarioByEmail(novoEmail)) {
                throw new ConflictException("Email já existe");
            }
            usuario.setEmail(novoEmail);
        }

        if (atualizarPerfilRequest.getNome() != null && !atualizarPerfilRequest.getNome().isBlank()) {
            usuario.setNome(atualizarPerfilRequest.getNome());
        }

        usuarioRepository.save(usuario);
        return PerfilUsuarioDto.fromUsuario(usuario);
    }
}
