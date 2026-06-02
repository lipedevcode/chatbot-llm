package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {
}
