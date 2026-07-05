package com.chatbotllm.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Finaliza o título do chat: normaliza o título gerado pela LLM e garante um
 * título de fallback derivado da mensagem do usuário quando o título vem vazio,
 * de modo que a conversa sempre tenha um título. Não faz chamadas à LLM — o
 * título é produzido junto da resposta pelo {@code TitledAssistant} em uma única
 * requisição.
 */
@Slf4j
@Service
public class ChatTitleService {

    private static final int MAX_TITLE_LENGTH = 60;
    private static final String DEFAULT_TITLE = "Nova conversa";

    /**
     * Normaliza {@code rawTitle} (título gerado pela LLM). Se ficar vazio, deriva
     * um título a partir de {@code fallbackSource} (normalmente a mensagem crua do
     * usuário) e, em último caso, usa um título padrão.
     */
    public String finalizeTitle(String rawTitle, String fallbackSource) {
        String title = sanitize(rawTitle);
        return title.isBlank() ? buildFallbackTitle(fallbackSource) : title;
    }

    private String buildFallbackTitle(String userMessage) {
        String title = sanitize(userMessage);
        return title.isBlank() ? DEFAULT_TITLE : title;
    }

    private String sanitize(String value) {
        if (value == null) {
            return "";
        }
        // Normaliza espaços/quebras de linha e remove aspas que a LLM às vezes adiciona.
        String cleaned = value.replaceAll("\\s+", " ").trim();
        cleaned = cleaned.replaceAll("^[\"']+|[\"']+$", "").trim();
        if (cleaned.length() > MAX_TITLE_LENGTH) {
            cleaned = cleaned.substring(0, MAX_TITLE_LENGTH).trim() + "...";
        }
        return cleaned;
    }
}
