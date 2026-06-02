package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Response;
import com.chatbotllm.backend.repositories.HistoryRepository;
import com.chatbotllm.backend.repositories.PromptRepository;
import com.chatbotllm.backend.repositories.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final HistoryRepository historyRepository;
    private final PromptRepository promptRepository;
    private final ResponseRepository responseRepository;

    @Transactional
    public void saveInteraction(String userMessage, String aiMessage, History history) {
        Response response = Response.builder()
                .text(aiMessage)
                .build();

        responseRepository.save(response);

        Prompt prompt = Prompt.builder()
                .text(userMessage)
                .history(history)
                .response(response)
                .build();

        promptRepository.save(prompt);

        history.getPrompts().add(prompt);

        historyRepository.save(history);
    }
}
