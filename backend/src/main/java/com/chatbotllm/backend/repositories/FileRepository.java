package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FileRepository extends JpaRepository<File, UUID> {
}
