package com.chatbotllm.backend.service;

import com.chatbotllm.backend.inteface.personas.ChatTitleGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatTitleServiceTest {

    @Mock
    private ChatTitleGenerator chatTitleGenerator;

    private ChatTitleService chatTitleService;

    @BeforeEach
    void setUp() {
        chatTitleService = new ChatTitleService(chatTitleGenerator);
    }

    @Test
    void shouldReturnTitleFromGenerator() {
        when(chatTitleGenerator.generateTitle(any())).thenReturn("Receita de bolo de cenoura");

        String title = chatTitleService.generateTitle("Como faço um bolo de cenoura?");

        assertEquals("Receita de bolo de cenoura", title);
    }

    @Test
    void shouldSanitizeSurroundingQuotesAndWhitespace() {
        when(chatTitleGenerator.generateTitle(any())).thenReturn("  \"Título   com aspas\"\n");

        String title = chatTitleService.generateTitle("mensagem");

        assertEquals("Título com aspas", title);
    }

    @Test
    void shouldTruncateLongTitle() {
        String longTitle = "palavra ".repeat(30).trim();
        when(chatTitleGenerator.generateTitle(any())).thenReturn(longTitle);

        String title = chatTitleService.generateTitle("mensagem");

        assertTrue(title.length() <= 63); // 60 + "..."
        assertTrue(title.endsWith("..."));
    }

    @Test
    void shouldFallbackToMessageWhenGeneratorReturnsBlank() {
        when(chatTitleGenerator.generateTitle(any())).thenReturn("   ");

        String title = chatTitleService.generateTitle("Minha primeira pergunta");

        assertEquals("Minha primeira pergunta", title);
    }

    @Test
    void shouldFallbackToMessageWhenGeneratorThrows() {
        when(chatTitleGenerator.generateTitle(any())).thenThrow(new RuntimeException("LLM indisponível"));

        String title = chatTitleService.generateTitle("Minha primeira pergunta");

        assertEquals("Minha primeira pergunta", title);
    }

    @Test
    void shouldUseDefaultTitleWhenMessageAndGeneratorAreBlank() {
        when(chatTitleGenerator.generateTitle(any())).thenReturn("");

        String title = chatTitleService.generateTitle("   ");

        assertEquals("Nova conversa", title);
    }
}
