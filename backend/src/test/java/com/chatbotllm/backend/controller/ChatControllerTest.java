package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.dto.SessionDto;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatControllerTest {

    @Mock
    private ChatService chatService;

    private ChatController chatController;

    @BeforeEach
    void setUp() {
        chatController = new ChatController(chatService);
    }

    @Test
    void sendChatMessageShouldReturnCreatedResponseWithLocation() {
        SendChatMessageResponse serviceResponse = SendChatMessageResponse.builder()
                .history(new HistoryDto(7L, List.of(), new SessionDto("messages")))
                .aiMessage("Mensagem da IA")
                .build();
        when(chatService.sendChatMessage(any())).thenReturn(serviceResponse);

        ResponseEntity<Object> response = chatController.sendChatMessage(new com.chatbotllm.backend.data.request.SendChatMessageRequest());

        assertEquals(201, response.getStatusCode().value());
        assertEquals("/api/v1/history/7", response.getHeaders().getLocation().toString());
        assertEquals(serviceResponse, response.getBody());
        assertNotNull(response.getBody());
        verify(chatService).sendChatMessage(any());
    }
}

