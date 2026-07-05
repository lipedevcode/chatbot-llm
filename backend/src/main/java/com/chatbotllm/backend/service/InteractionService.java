package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Response;
import com.chatbotllm.backend.repositories.FileRepository;
import com.chatbotllm.backend.repositories.HistoryRepository;
import com.chatbotllm.backend.repositories.PromptRepository;
import com.chatbotllm.backend.repositories.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final HistoryRepository historyRepository;
    private final PromptRepository promptRepository;
    private final ResponseRepository responseRepository;
    private final FileRepository fileRepository;
    private final AuthService authService;

    @Transactional
    public void saveInteraction(String userMessage, String aiMessage, History history) {
        this.saveInteraction(userMessage, aiMessage, history, null);
    }

    @Transactional
    public void saveInteraction(String userMessage, String aiMessage, History history, List<File> files) {
        List<File> safeFiles = Objects.requireNonNullElse(files, List.of());

        Response response = Response.builder()
                .text(aiMessage)
                .build();

        responseRepository.save(response);

        Prompt prompt = Prompt.builder()
                .text(userMessage)
                .history(history)
                .response(response)
                .usuario(this.authService.getAuthenticatedUser())
                .files(safeFiles)
                .build();

        promptRepository.save(prompt);

        history.getPrompts().add(prompt);

        historyRepository.save(history);

        if (!safeFiles.isEmpty()) {
            safeFiles.forEach(file -> file.setPrompt(prompt));
            fileRepository.saveAll(safeFiles);
        }
    }
}
