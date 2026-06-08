package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromptRepository extends JpaRepository<Prompt, Long> {
}
