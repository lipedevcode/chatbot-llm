package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findAllByUsuarioId(Long usuarioId);
}
