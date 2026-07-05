package com.chatbotllm.backend.security;

import com.chatbotllm.backend.data.model.Usuario;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateJwtToken() throws Exception {
        JwtService jwtService = new JwtService();
        setField(jwtService, "secret", base64Secret());
        setField(jwtService, "expiration", 60_000L);

        Usuario usuario = new Usuario();
        usuario.setUsername("subject-xyz");

        String token = jwtService.generateToken(usuario);

        assertNotNull(token);
        assertEquals("subject-xyz", jwtService.extractSubject(token));
        assertTrue(jwtService.isValid(token, usuario));
    }

    @Test
    void shouldInvalidateTokenForDifferentUser() throws Exception {
        JwtService jwtService = new JwtService();
        setField(jwtService, "secret", base64Secret());
        setField(jwtService, "expiration", 60_000L);

        Usuario usuario = new Usuario();
        usuario.setUsername("subject-xyz");

        String token = jwtService.generateToken(usuario);

        Usuario otherUser = new Usuario();
        otherUser.setUsername("other-subject");

        assertFalse(jwtService.isValid(token, otherUser));
    }

    private static void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private static String base64Secret() {
        byte[] rawSecret = "01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(rawSecret);
    }
}

