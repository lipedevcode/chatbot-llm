package com.chatbotllm.backend.data.request;

import lombok.Data;

@Data
public class SigninRequest {
    private String email;
    private String password;
}
