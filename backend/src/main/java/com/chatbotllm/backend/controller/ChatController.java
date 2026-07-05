package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.exception.BadRequestException;
import com.chatbotllm.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat")
@Validated
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<Object> sendChatMessage(@Valid @RequestBody SendChatMessageRequest sendChatMessageRequest) {
        SendChatMessageResponse sendChatMessageResponse = this.chatService.sendChatMessage(sendChatMessageRequest);
        return ResponseEntity
                .created(URI.create("/api/v1/history/" + sendChatMessageResponse.getHistory().id()))
                .body(sendChatMessageResponse);
    }

    @PostMapping(value = "/message", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> sendChatMessage(@RequestParam(value = "historyId", required = false) Long historyId,
                                                  @RequestParam(value = "message", required = false, defaultValue = "") String message,
                                                  @RequestParam(value = "files", required = false) List<MultipartFile> files){
        // Mensagem é opcional aqui: um documento sozinho é resumido com o prompt
        // padrão de resumo (ver GenericAssistant/TitledAssistant). Só bloqueia se
        // não vier nem texto nem arquivo algum.
        if (message.isBlank() && (files == null || files.isEmpty())) {
            throw new BadRequestException("Envie uma mensagem ou anexe um documento.");
        }
        SendChatMessageResponse sendChatMessageResponse = this.chatService.sendChatMessage(historyId, message, files);
        return ResponseEntity
                .created(URI.create("/api/v1/history/" + sendChatMessageResponse.getHistory().id()))
                .body(sendChatMessageResponse);
    }

}
