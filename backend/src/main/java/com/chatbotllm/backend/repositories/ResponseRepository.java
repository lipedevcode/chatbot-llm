package com.chatbotllm.backend.repositories;

import com.chatbotllm.backend.data.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseRepository extends JpaRepository<Response, Long> {
}
