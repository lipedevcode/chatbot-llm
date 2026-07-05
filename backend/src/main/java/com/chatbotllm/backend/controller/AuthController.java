package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.request.SigninRequest;
import com.chatbotllm.backend.data.request.SignupRequest;
import com.chatbotllm.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity
                .ok()
                .body(this.authService.signup(signupRequest));
    }
    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody SigninRequest signinRequest) {
        return ResponseEntity
                .ok()
                .body(this.authService.login(signinRequest));
    }

}