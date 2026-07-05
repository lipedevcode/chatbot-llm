package com.chatbotllm.backend.data.dto;

import java.util.UUID;


public record FileDto(UUID id, String filename, ResponseDto response) {

}
