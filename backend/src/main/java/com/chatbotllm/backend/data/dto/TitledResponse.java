package com.chatbotllm.backend.data.dto;

import dev.langchain4j.model.output.structured.Description;

/**
 * Resposta estruturada usada na primeira mensagem de uma conversa: em uma única
 * chamada à LLM obtemos tanto a resposta ao usuário quanto o título do chat,
 * evitando uma segunda requisição só para gerar o título.
 */
public record TitledResponse(
        @Description("Título curto com no máximo 5 palavras que resume o assunto da conversa, no mesmo idioma da mensagem do usuário, sem aspas e sem pontuação final")
        String title,
        @Description("Resposta completa, precisa e útil à mensagem do usuário")
        String answer
) {
}
