package com.chatbotllm.backend.exception;

// Conflito de estado (e-mail/username já em uso, etc.) — mapeada para 409.
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
