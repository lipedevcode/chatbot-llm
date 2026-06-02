package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.request.RequestSendChatMessage;
import com.chatbotllm.backend.data.response.ResponseSendChatMessage;
import com.chatbotllm.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    /*TODO: em metodos controllers
    *  * validação token
    *  * validação parameters
     */

    @PostMapping("/message")
    public ResponseEntity<Object> sendChatMessage(@RequestBody RequestSendChatMessage requestSendChatMessage) {
        ResponseSendChatMessage responseSendChatMessage = this.chatService.sendChatMessage(requestSendChatMessage);
        return ResponseEntity
                .created(URI.create("/api/v1/history/" + responseSendChatMessage.getHistory().getId()))
                .body(responseSendChatMessage);
    }

}
