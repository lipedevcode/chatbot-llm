package com.chatbotllm.backend.exception;

// Usuário autenticado tentando acessar um recurso que não é dele — mapeada para 403.
// Nome próprio para não colidir com org.springframework.security.access.AccessDeniedException.
public class ForbiddenOperationException extends RuntimeException {
    public ForbiddenOperationException(String message) {
        super(message);
    }
}
