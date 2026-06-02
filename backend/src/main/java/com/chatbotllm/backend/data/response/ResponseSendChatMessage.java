package com.chatbotllm.backend.data.response;

import com.chatbotllm.backend.data.model.History;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseSendChatMessage {
    private History history;
    private String aiMessage;
}
