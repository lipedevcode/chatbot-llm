package com.chatbotllm.backend.data.request;

import lombok.Data;

@Data
public class SendChatMessageRequest {
    private Long historyId;
    private String userMessage;
}
