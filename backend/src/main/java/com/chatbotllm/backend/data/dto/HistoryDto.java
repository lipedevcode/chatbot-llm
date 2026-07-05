package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.Prompt;

import java.util.Comparator;
import java.util.List;

public record HistoryDto (Long id, String title, List<PromptDto> prompts){

    public static HistoryDto fromHistory(Long id, String title, List<Prompt> prompts) {
        List<PromptDto> promptsDto = prompts.stream()
                .sorted(Comparator.comparingLong(Prompt::getId))
                .map(prompt -> PromptDto.fromPrompt(prompt.getText(), prompt.getResponse(), prompt.getFiles()))
                .toList();
        return new HistoryDto(id, title, promptsDto);
    }
}
