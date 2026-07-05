package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.Usuario;

import java.time.Instant;

public record PerfilUsuarioDto(Long id, String nome, String username, String email, Instant createdAt) {

    public static PerfilUsuarioDto fromUsuario(Usuario usuario) {
        return new PerfilUsuarioDto(
                usuario.getId(),
                usuario.getNome(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getCreatedAt()
        );
    }
}
