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
    private final ChatTitleService chatTitleService;

    public SendChatMessageResponse sendChatMessage(SendChatMessageRequest sendChatMessageRequest) {
        return this.sendChatMessage(sendChatMessageRequest.getHistoryId(), sendChatMessageRequest.getUserMessage());
    }

    public SendChatMessageResponse sendChatMessage(Long historyId, String userMessage){
        History history = this.historyService.resolveHistory(historyId);

        if (history.getPrompts() == null){
            history.setPrompts(new ArrayList<>());
            }

        this.ensureTitle(history, userMessage);

        Long sessionMemoryId = history.getSession().getMemoryId();

        String aiMessage = genericAssistant.chat(sessionMemoryId, userMessage);

        this.interactionService.saveInteraction(userMessage, aiMessage, history);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getTitle(), history.getPrompts()))
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

        // O título considera o conteúdo do anexo + o prompt do usuário; o fallback usa
        // apenas a mensagem crua, para não expor o conteúdo do documento no título.
        this.ensureTitle(history, userMessageWithFiles, userMessage);

        String aiMessage = genericAssistant.chat(sessionMemoryId, userMessageWithFiles, pagesPdf);

        this.interactionService.saveInteraction(userMessageWithFiles, aiMessage, history, files);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getTitle(), history.getPrompts()))
                .build();
    }

    /**
     * Define o título do chat na primeira mensagem de uma conversa nova.
     * Conversas já existentes (com título ou com prompts) permanecem inalteradas.
     */
    private void ensureTitle(History history, String userMessage) {
        this.ensureTitle(history, userMessage, userMessage);
    }

    private void ensureTitle(History history, String contentForTitle, String fallbackSource) {
        boolean semTitulo = history.getTitle() == null || history.getTitle().isBlank();
        if (semTitulo && history.getPrompts().isEmpty()) {
            history.setTitle(this.chatTitleService.generateTitle(contentForTitle, fallbackSource));
        }
    }
}