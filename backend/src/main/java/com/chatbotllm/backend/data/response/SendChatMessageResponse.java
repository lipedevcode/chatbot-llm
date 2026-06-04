package com.chatbotllm.backend.data.response;

import com.chatbotllm.backend.data.dto.HistoryDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendChatMessageResponse {
    private HistoryDto history;
    private String aiMessage;
}
