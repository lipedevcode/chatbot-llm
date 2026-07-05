package com.chatbotllm.backend.exception;

// Requisição do cliente inválida (ex.: arquivo em formato não suportado) — mapeada para 400.
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
