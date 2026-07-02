package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

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
    public ResponseEntity<Object> sendChatMessage(@RequestBody SendChatMessageRequest sendChatMessageRequest) {
        SendChatMessageResponse sendChatMessageResponse = this.chatService.sendChatMessage(sendChatMessageRequest);
        return ResponseEntity
                .created(URI.create("/api/v1/history/" + sendChatMessageResponse.getHistory().id()))
                .body(sendChatMessageResponse);
    }

    @PostMapping(value = "/message", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> sendChatMessage(@RequestParam(value = "historyId", required = false) Long historyId,
                                                  @RequestParam("message") String message,
                                                  @RequestParam(value = "files", required = false) List<MultipartFile> files){
        SendChatMessageResponse sendChatMessageResponse = this.chatService.sendChatMessage(historyId, message, files);
        return ResponseEntity
                .created(URI.create("/api/v1/history/" + sendChatMessageResponse.getHistory().id()))
                .body(sendChatMessageResponse);
    }

}
