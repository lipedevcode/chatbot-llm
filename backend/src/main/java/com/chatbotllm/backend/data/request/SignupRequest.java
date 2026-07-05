package com.chatbotllm.backend.data.request;

import lombok.Data;

@Data
public class SignupRequest {
    private String nome;
    private String username;
    private String email;
    private String password;
}