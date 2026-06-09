package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ChatService {

    private final HistoryService historyService;
    private final InteractionService interactionService;
    private final GenericAssistant genericAssistant;

    public SendChatMessageResponse sendChatMessage(SendChatMessageRequest sendChatMessageRequest) {
        History history = this.historyService.resolveHistory(sendChatMessageRequest.getHistoryId());

        if (history.getPrompts() == null)
            history.setPrompts(new ArrayList<>());

        Long sessionMemoryId = history.getSession().getMemoryId();

        String aiMessage = genericAssistant.chat(sessionMemoryId, sendChatMessageRequest.getUserMessage());

        this.interactionService.saveInteraction(sendChatMessageRequest.getUserMessage(), aiMessage, history);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getPrompts(), history.getSession()))
                .build();
    }
}