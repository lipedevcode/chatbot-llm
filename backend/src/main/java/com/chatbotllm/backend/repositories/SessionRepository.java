package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByMemoryId(Long memoryId);
}
