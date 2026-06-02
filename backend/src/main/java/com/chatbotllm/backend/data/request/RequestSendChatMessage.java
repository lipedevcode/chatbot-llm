package com.chatbotllm.backend.data.request;

import lombok.Data;
import lombok.NonNull;

@Data
public class RequestSendChatMessage {
    private Long historyId;
    @NonNull
    private String userMessage;
}
