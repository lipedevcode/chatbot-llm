package com.chatbotllm.backend.data.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendChatMessageRequest {
    private Long historyId;

    @NotBlank(message = "Mensagem é obrigatória")
    private String userMessage;
}
