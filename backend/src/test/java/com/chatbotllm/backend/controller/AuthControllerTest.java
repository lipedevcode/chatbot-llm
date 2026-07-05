package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.request.SignupRequest;
import com.chatbotllm.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        authController = new AuthController(authService);
    }

    @Test
    void signupShouldReturnJwtToken() {
        SignupRequest request = new SignupRequest();
        when(authService.signup(request)).thenReturn("jwt-token");

        ResponseEntity<Object> response = authController.signup(request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("jwt-token", response.getBody());
        assertNotNull(response.getBody());
        verify(authService).signup(request);
    }
}

