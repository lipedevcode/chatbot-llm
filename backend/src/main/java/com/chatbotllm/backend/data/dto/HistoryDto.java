package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Session;

import java.util.List;

public record HistoryDto (Long id, List<PromptDto> prompts, SessionDto session){

    public static HistoryDto fromHistory(Long id, List<Prompt> prompts, Session session) {
        List<PromptDto> promptsDto = prompts.stream()
            .map(prompt -> PromptDto.fromPrompt(prompt.getText(), prompt.getResponse()))
            .toList();
        return new HistoryDto(id, promptsDto, new SessionDto(session.getMessages()));
    }
}
