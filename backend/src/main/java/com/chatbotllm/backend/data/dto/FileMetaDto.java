package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Response;

import java.util.UUID;

public record FileMetaDto(UUID id, String filename, Long historyId, String resumo) {

    public static FileMetaDto fromFile(File file) {
        Prompt prompt = file.getPrompt();
        Long historyId = prompt != null && prompt.getHistory() != null ? prompt.getHistory().getId() : null;
        Response response = prompt != null ? prompt.getResponse() : null;
        String resumo = response != null ? response.getText() : null;
        return new FileMetaDto(file.getId(), file.getFilename(), historyId, resumo);
    }
}
