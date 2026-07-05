package com.chatbotllm.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ChatTitleServiceTest {

    private ChatTitleService chatTitleService;

    @BeforeEach
    void setUp() {
        chatTitleService = new ChatTitleService();
    }

    @Test
    void shouldReturnSanitizedTitleFromLlm() {
        String title = chatTitleService.finalizeTitle("Receita de bolo de cenoura", "Como faço um bolo de cenoura?");

        assertEquals("Receita de bolo de cenoura", title);
    }

    @Test
    void shouldSanitizeSurroundingQuotesAndWhitespace() {
        String title = chatTitleService.finalizeTitle("  \"Título   com aspas\"\n", "mensagem");

        assertEquals("Título com aspas", title);
    }

    @Test
    void shouldTruncateLongTitle() {
        String longTitle = "palavra ".repeat(30).trim();

        String title = chatTitleService.finalizeTitle(longTitle, "mensagem");

        assertTrue(title.length() <= 63); // 60 + "..."
        assertTrue(title.endsWith("..."));
    }

    @Test
    void shouldFallbackToMessageWhenLlmTitleIsBlank() {
        String title = chatTitleService.finalizeTitle("   ", "Minha primeira pergunta");

        assertEquals("Minha primeira pergunta", title);
    }

    @Test
    void shouldFallbackToMessageWhenLlmTitleIsNull() {
        String title = chatTitleService.finalizeTitle(null, "Minha primeira pergunta");

        assertEquals("Minha primeira pergunta", title);
    }

    @Test
    void shouldUseDefaultTitleWhenLlmTitleAndMessageAreBlank() {
        String title = chatTitleService.finalizeTitle("", "   ");

        assertEquals("Nova conversa", title);
    }
}
