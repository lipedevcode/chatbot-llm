package com.chatbotllm.backend.service;

import com.chatbotllm.backend.inteface.personas.ChatTitleGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatTitleService {

    private final ChatTitleGenerator chatTitleGenerator;

    private static final int MAX_TITLE_LENGTH = 60;
    private static final String DEFAULT_TITLE = "Nova conversa";
    // Limita o que é enviado à LLM: um anexo pode ter muito texto, e o título só
    // precisa do começo do conteúdo para resumir o assunto.
    private static final int MAX_INPUT_LENGTH = 4000;

    /**
     * Gera um título para a conversa a partir da primeira mensagem do usuário.
     * Usa a LLM e, em caso de falha ou resposta vazia, recorre a um título derivado
     * da própria mensagem, garantindo que o chat sempre tenha um título.
     */
    public String generateTitle(String userMessage) {
        return generateTitle(userMessage, userMessage);
    }

    /**
     * Gera um título usando {@code contentForTitle} como base para a LLM (pode incluir o
     * conteúdo de anexos, para que o assunto do documento seja considerado) e
     * {@code fallbackSource} como fonte do título de fallback (normalmente a mensagem
     * crua do usuário, para não expor o conteúdo do documento caso a LLM falhe).
     */
    public String generateTitle(String contentForTitle, String fallbackSource) {
        String fallback = buildFallbackTitle(fallbackSource);
        try {
            String title = sanitize(chatTitleGenerator.generateTitle(truncateInput(contentForTitle)));
            return title.isBlank() ? fallback : title;
        } catch (Exception e) {
            log.warn("Falha ao gerar título via LLM. Usando título derivado da mensagem.", e);
            return fallback;
        }
    }

    private String truncateInput(String value) {
        if (value == null) {
            return "";
        }
        return value.length() > MAX_INPUT_LENGTH ? value.substring(0, MAX_INPUT_LENGTH) : value;
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
