package com.chatbotllm.backend.data.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class AtualizarPerfilRequest {
    // Campos opcionais (PUT parcial) — só valida formato quando preenchido.
    private String nome;

    @Email(message = "Email inválido")
    private String email;
}
