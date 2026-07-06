package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FileRepository extends JpaRepository<File, UUID> {
    List<File> findByPrompt_Usuario_Id(Long usuarioId);
}
