package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import com.chatbotllm.backend.repositories.SessionRepository;
import com.chatbotllm.backend.utils.PersistentChatMemoryStore;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${gemini.api.key}")
    private String GEMINI_API_KEY;

    @Value("${gemini.openai.url}")
    private String GEMINI_OPEN_AI_URL;


    private final Integer MAX_MESSAGES_WINDOW = 10;

    private final SessionRepository sessionRepository;
    private final HistoryService historyService;
    private final InteractionService interactionService;

    public SendChatMessageResponse sendChatMessage(SendChatMessageRequest sendChatMessageRequest) {
        ChatMemoryProvider chatMemoryProvider = memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(MAX_MESSAGES_WINDOW)
                .chatMemoryStore(new PersistentChatMemoryStore(sessionRepository))
                .build();

        ChatModel model = OpenAiChatModel.builder()
                .baseUrl(GEMINI_OPEN_AI_URL)
                .apiKey(GEMINI_API_KEY)
                .modelName("gemini-3.1-flash-lite")
                .build();

        GenericAssistant genericAssistant = AiServices.builder(GenericAssistant.class)
                .chatModel(model)
                .chatMemoryProvider(chatMemoryProvider)
                .build();

        History history = this.historyService.resolveHistory(sendChatMessageRequest.getHistoryId());

        if (history.getPrompts() == null)
            history.setPrompts(new ArrayList<>());

        Long sessionMemoryId = history.getSession().getMemoryId();

        String aiMessage = genericAssistant.chat(sessionMemoryId, sendChatMessageRequest.getUserMessage());

        this.interactionService.saveInteraction(sendChatMessageRequest.getUserMessage(), aiMessage, history);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(history)
                .build();
    }
}