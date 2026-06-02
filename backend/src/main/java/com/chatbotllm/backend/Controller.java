package com.chatbotllm.backend;

import com.chatbotllm.backend.data.request.RequestSendChatMessage;
import com.chatbotllm.backend.data.response.ResponseSendChatMessage;
import com.chatbotllm.backend.service.ChatService;
import com.chatbotllm.backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat")
public class Controller {

    private final ChatService chatService;
    private final HistoryService historyService;

    /*TODO: em metodos controllers
    *  * validação token
    *  * validação parameters
     */

    @PostMapping("/message")
    public ResponseEntity<Object> sendChatMessage(@RequestBody RequestSendChatMessage requestSendChatMessage) {
        ResponseSendChatMessage responseSendChatMessage = this.chatService.sendChatMessage(requestSendChatMessage);
        return ResponseEntity
                .created(URI.create("/api/v1/chat/history/" + responseSendChatMessage.getHistory().getId()))
                .body(responseSendChatMessage);
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<Object> getHistory(@PathVariable Long id) {
        return ResponseEntity
                .ok()
                .body(this.historyService.getHistory(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllHistories() {
        return ResponseEntity
                .ok()
                .body(this.historyService.getAllHistories());
    }

}
