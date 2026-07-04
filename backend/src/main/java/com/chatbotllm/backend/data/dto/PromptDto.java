package com.chatbotllm.backend.data.dto;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.Response;

import java.util.List;

public record PromptDto(String text, ResponseDto response, List<FileDto> files) {
    public static PromptDto fromPrompt(String text, Response response, List<File> files) {
        List<FileDto> filesDto = files == null ? List.of() : files.stream().map(FileDto::fromFile).toList();
        return new PromptDto(text, new ResponseDto(response.getText()), filesDto);
    }
}
