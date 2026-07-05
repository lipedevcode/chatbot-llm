package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.data.request.SignupRequest;
import com.chatbotllm.backend.repositories.UsuarioRepository;
import com.chatbotllm.backend.security.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(usuarioRepository, jwtService);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void signupShouldPersistUsuarioAndReturnJwtToken() {
        SignupRequest request = new SignupRequest();
        request.setNome("Fulano de Tal");
        request.setUsername("fulano");
        request.setEmail("fulano@example.com");
        request.setPassword("senha123");

        when(usuarioRepository.existsUsuarioByUsername("fulano")).thenReturn(false);
        when(usuarioRepository.existsUsuarioByEmail("fulano@example.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(Usuario.class))).thenReturn("jwt-token");

        String token = authService.signup(request);

        assertEquals("jwt-token", token);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioCaptor.capture());
        verify(jwtService).generateToken(usuarioCaptor.getValue());

        Usuario saved = usuarioCaptor.getValue();
        assertEquals("fulano", saved.getUsername());
        assertEquals("fulano@example.com", saved.getEmail());
        assertEquals("Fulano de Tal", saved.getNome());
        // A senha é armazenada como hash SHA-256 (64 caracteres hexadecimais).
        assertNotNull(saved.getPassword());
        assertEquals(64, saved.getPassword().length());
    }

    @Test
    void getAuthenticatedUserShouldReturnUsuarioFromSecurityContext() {
        Usuario usuario = new Usuario();
        usuario.setId(10L);
        usuario.setUsername("subject-123");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        User.withUsername("subject-123").password("").roles().build(),
                        null, List.of()
                )
        );
        when(usuarioRepository.findByUsername("subject-123")).thenReturn(Optional.of(usuario));

        Usuario authenticatedUser = authService.getAuthenticatedUser();

        assertSame(usuario, authenticatedUser);
    }

    @Test
    void getAuthenticatedUserShouldThrowWhenThereIsNoAuthentication() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.getAuthenticatedUser());

        assertEquals("Nenhum usuário autenticado encontrado", exception.getMessage());
    }
}

