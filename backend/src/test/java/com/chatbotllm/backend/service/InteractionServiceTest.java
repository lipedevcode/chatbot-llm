package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Response;
import com.chatbotllm.backend.data.model.Session;
import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.repositories.HistoryRepository;
import com.chatbotllm.backend.repositories.PromptRepository;
import com.chatbotllm.backend.repositories.ResponseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InteractionServiceTest {

    @Mock
    private HistoryRepository historyRepository;

    @Mock
    private PromptRepository promptRepository;

    @Mock
    private ResponseRepository responseRepository;

    @Mock
    private AuthService authService;

    private InteractionService interactionService;

    @BeforeEach
    void setUp() {
        interactionService = new InteractionService(historyRepository, promptRepository, responseRepository, authService);
    }

    @Test
    void saveInteractionShouldPersistResponsePromptAndHistory() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setSubject("subject-1");

        History history = new History();
        history.setId(2L);
        history.setPrompts(new ArrayList<>());
        history.setSession(new Session(3L, "messages"));

        when(authService.getAuthenticatedUser()).thenReturn(usuario);
        when(responseRepository.save(any(Response.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(promptRepository.save(any(Prompt.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(historyRepository.save(any(History.class))).thenAnswer(invocation -> invocation.getArgument(0));

        interactionService.saveInteraction("Olá", "Resposta da IA", history);

        ArgumentCaptor<Response> responseCaptor = ArgumentCaptor.forClass(Response.class);
        ArgumentCaptor<Prompt> promptCaptor = ArgumentCaptor.forClass(Prompt.class);

        verify(responseRepository).save(responseCaptor.capture());
        verify(promptRepository).save(promptCaptor.capture());
        verify(historyRepository).save(history);

        assertEquals("Resposta da IA", responseCaptor.getValue().getText());
        assertEquals("Olá", promptCaptor.getValue().getText());
        assertSame(history, promptCaptor.getValue().getHistory());
        assertSame(usuario, promptCaptor.getValue().getUsuario());
        assertEquals(1, history.getPrompts().size());
        assertSame(promptCaptor.getValue(), history.getPrompts().getFirst());
    }
}

