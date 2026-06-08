package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.Response;

public record PromptDto(String text, ResponseDto response) {
    public static PromptDto fromPrompt (String text, Response response) {
        return new PromptDto(text, new ResponseDto(response.getText()));
    }
    public static PromptDto fromPrompt (String text, ResponseDto response) {
        return new PromptDto(text, response);
    }
}
