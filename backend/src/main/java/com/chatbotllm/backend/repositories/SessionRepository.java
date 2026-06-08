package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
