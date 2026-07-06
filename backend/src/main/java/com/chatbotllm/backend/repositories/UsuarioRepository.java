package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);

    boolean existsUsuarioByUsername(String username);

    boolean existsUsuarioByEmail(String email);
}
