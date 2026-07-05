package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import dev.langchain4j.data.message.ImageContent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ChatService {

    private final HistoryService historyService;
    private final InteractionService interactionService;
    private final FileService fileService;
    private final GenericAssistant genericAssistant;

    public SendChatMessageResponse sendChatMessage(SendChatMessageRequest sendChatMessageRequest) {
        return this.sendChatMessage(sendChatMessageRequest.getHistoryId(), sendChatMessageRequest.getUserMessage());
    }

    public SendChatMessageResponse sendChatMessage(Long historyId, String userMessage){
        History history = this.historyService.resolveHistory(historyId);

        if (history.getPrompts() == null){
            history.setPrompts(new ArrayList<>());
            }

        Long sessionMemoryId = history.getSession().getMemoryId();

        String aiMessage = askAssistant(() -> genericAssistant.chat(sessionMemoryId, userMessage));

        this.interactionService.saveInteraction(userMessage, aiMessage, history);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getPrompts()))
                .build();
    }

    public SendChatMessageResponse sendChatMessage(Long historyId, String userMessage, List<MultipartFile> multipartFiles){
        History history = this.historyService.resolveHistory(historyId);

        if (history.getPrompts() == null) {
            history.setPrompts(new ArrayList<>());
        }

        Long sessionMemoryId = history.getSession().getMemoryId();

        List<File> files = this.fileService.createFromMultipartFiles(multipartFiles);

        List<String> extractedTexts = this.fileService.getTextsFromFiles(files);

        List<ImageContent> pagesPdf = this.fileService.getPagesImagesFromFiles(files);

        String userMessageWithFiles = String.join("\n\n", extractedTexts) +  "\n\n" + "## Prompt do usuário: " + userMessage;

        String aiMessage = askAssistant(() -> genericAssistant.chat(sessionMemoryId, userMessageWithFiles, pagesPdf));

        this.interactionService.saveInteraction(userMessageWithFiles, aiMessage, history, files);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getPrompts()))
                .build();
    }

    // Isola falhas do provedor de LLM (timeout, rate-limit, resposta inválida) com
    // uma mensagem clara. Continua virando 500 (é uma falha de serviço externo,
    // não do cliente), mas com corpo estruturado em vez do whitelabel do Spring.
    private String askAssistant(java.util.function.Supplier<String> call) {
        try {
            return call.get();
        } catch (RuntimeException e) {
            log.error("Erro ao consultar o assistente de IA: {}", e.getMessage(), e);
            throw new RuntimeException("Não foi possível obter resposta da IA no momento. Tente novamente.", e);
        }
    }
}