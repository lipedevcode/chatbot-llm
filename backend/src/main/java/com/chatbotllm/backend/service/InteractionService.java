package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Response;
import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.exception.ResourceNotFoundException;
import com.chatbotllm.backend.repositories.FileRepository;
import com.chatbotllm.backend.repositories.HistoryRepository;
import com.chatbotllm.backend.repositories.PromptRepository;
import com.chatbotllm.backend.repositories.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    /**
     * Persiste uma interação produzida pelo fluxo de streaming.
     * <p>
     * Diferente de {@link #saveInteraction(String, String, History, List)}, recebe
     * o {@code historyId} e o {@code usuario} explicitamente — e re-busca o
     * {@link History} dentro desta transação — porque é chamada no callback de
     * conclusão do stream, que roda em uma thread de background sem
     * {@code SecurityContext} nem sessão do Hibernate aberta (sem OSIV). Assim
     * evitamos acessar coleções lazy de uma entidade desanexada e a leitura do
     * usuário autenticado a partir do contexto de segurança.
     *
     * @param title título a definir quando a conversa ainda não tem um (primeira
     *              mensagem); {@code null} para não alterar o título existente.
     */
    @Transactional
    public void saveStreamedInteraction(Long historyId, String userMessage, String aiMessage, Usuario usuario, String title) {
        History history = historyRepository.findById(historyId)
                .orElseThrow(() -> new ResourceNotFoundException("History #" + historyId + " não encontrado"));

        if (title != null && (history.getTitle() == null || history.getTitle().isBlank())) {
            history.setTitle(title);
        }

        Response response = Response.builder()
                .text(aiMessage)
                .build();

        responseRepository.save(response);

        Prompt prompt = Prompt.builder()
                .text(userMessage)
                .history(history)
                .response(response)
                .usuario(usuario)
                .files(List.of())
                .build();

        promptRepository.save(prompt);

        if (history.getPrompts() == null) {
            history.setPrompts(new ArrayList<>());
        }
        history.getPrompts().add(prompt);

        historyRepository.save(history);
    }
}
