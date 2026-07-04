package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.File;

import java.util.UUID;

public record FileDto(UUID id, String filename) {
    public static FileDto fromFile(File file) {
        return new FileDto(file.getId(), file.getFilename());
    }
}
