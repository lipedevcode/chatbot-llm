package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.Response;

import java.util.List;

public record PromptDto(String text, ResponseDto response, List<FileDto> files) {
    public static PromptDto fromPrompt (String text, Response response, List<File> files) {
        List<File> safeFiles = files == null ? List.of() : files;
        return new PromptDto(
                text,
                new ResponseDto(response.getText()),
                safeFiles.stream().map(file -> new FileDto(file.getId(), file.getFilename(), new ResponseDto(response.getText()))).toList()
        );
    }
    public static PromptDto fromPrompt (String text, ResponseDto response, List<FileDto> files) {
        return new PromptDto(text, response, files);
    }
}
