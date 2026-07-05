package com.chatbotllm.backend.exception;

// Credenciais inválidas ou usuário não autenticado — mapeada para 401.
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
