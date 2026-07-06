package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Prompt;
import com.chatbotllm.backend.data.model.Response;
import com.chatbotllm.backend.data.model.Session;
import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.repositories.HistoryRepository;
import com.chatbotllm.backend.repositories.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HistoryServiceTest {

    @Mock
    private HistoryRepository historyRepository;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private AuthService authService;

    private HistoryService historyService;

    @BeforeEach
    void setUp() {
        historyService = new HistoryService(historyRepository, sessionRepository, authService);
    }

    @Test
    void resolveHistoryShouldCreateNewHistoryWhenIdIsNull() {
        Usuario usuario = new Usuario();
        usuario.setId(7L);
        usuario.setUsername("subject-abc");

        Session session = new Session();
        session.setMemoryId(11L);

        History savedHistory = new History();
        savedHistory.setId(22L);
        savedHistory.setSession(session);
        savedHistory.setUsuario(usuario);
        savedHistory.setPrompts(List.of());

        when(authService.getAuthenticatedUser()).thenReturn(usuario);
        when(sessionRepository.save(any(Session.class))).thenAnswer(invocation -> {
            Session argument = invocation.getArgument(0);
            argument.setMemoryId(11L);
            return argument;
        });
        when(historyRepository.save(any(History.class))).thenAnswer(invocation -> {
            History argument = invocation.getArgument(0);
            argument.setId(22L);
            argument.setPrompts(List.of());
            return argument;
        });

        History resolvedHistory = historyService.resolveHistory(null);

        assertEquals(22L, resolvedHistory.getId());
        assertEquals(11L, resolvedHistory.getSession().getMemoryId());
        assertSame(usuario, resolvedHistory.getUsuario());
        verify(sessionRepository).save(any(Session.class));
        verify(historyRepository).save(any(History.class));
    }

    @Test
    void resolveHistoryShouldReturnExistingHistoryWhenIdExists() {
        History history = new History();
        history.setId(5L);

        when(historyRepository.findById(5L)).thenReturn(Optional.of(history));

        History resolvedHistory = historyService.resolveHistory(5L);

        assertSame(history, resolvedHistory);
    }

    @Test
    void getHistoryShouldMapHistoryToDto() {
        Usuario usuario = new Usuario();
        usuario.setId(42L);

        Response response = Response.builder().text("Resposta da IA").build();
        Prompt prompt = Prompt.builder()
                .id(1L)
                .text("Pergunta do usuário")
                .response(response)
                .files(List.of())
                .build();
        Session session = new Session(1L, "mensagens");
        History history = new History();
        history.setId(1L);
        history.setPrompts(List.of(prompt));
        history.setSession(session);
        history.setUsuario(usuario);

        when(historyRepository.findById(1L)).thenReturn(Optional.of(history));
        when(authService.getAuthenticatedUser()).thenReturn(usuario);

        HistoryDto historyDto = historyService.getHistory(1L);

        assertEquals(1L, historyDto.id());
        assertEquals("Pergunta do usuário", historyDto.prompts().getFirst().text());
        assertEquals("Resposta da IA", historyDto.prompts().getFirst().response().text());
    }

    @Test
    void getAllHistoriesByUserShouldReturnMappedHistories() {
        Usuario usuario = new Usuario();
        usuario.setId(99L);
        usuario.setUsername("subject-user");

        Session session = new Session(1L, "messages");
        History history = new History();
        history.setId(3L);
        history.setPrompts(List.of());
        history.setSession(session);

        when(authService.getAuthenticatedUser()).thenReturn(usuario);
        when(historyRepository.findAllByUsuarioId(eq(99L))).thenReturn(List.of(history));

        List<HistoryDto> histories = historyService.getAllHistoriesByUser();

        assertEquals(1, histories.size());
        assertEquals(3L, histories.getFirst().id());
    }
}

