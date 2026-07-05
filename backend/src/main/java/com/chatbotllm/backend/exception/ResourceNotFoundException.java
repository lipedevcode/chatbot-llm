package com.chatbotllm.backend.exception;

// Recurso não encontrado (history, arquivo, etc.) — mapeada para 404 pelo GlobalExceptionHandler.
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
