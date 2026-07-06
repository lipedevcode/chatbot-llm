package com.chatbotllm.backend.inteface.personas;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Assistente stateless dedicado a gerar apenas um título curto para a conversa.
 * <p>
 * Usado no fluxo de streaming: como a resposta é transmitida token a token, não é
 * possível obtê-la junto do título em uma única saída estruturada (como faz o
 * {@link TitledAssistant} no fluxo não-streaming). Aqui o título é produzido em uma
 * chamada curta e barata, antes do início do streaming, para ser enviado no evento
 * inicial de metadados.
 */
public interface ChatTitleAssistant {

    @SystemMessage("""
            Gere um título curto, com no máximo 5 palavras, que resuma o assunto da mensagem do usuário.
            Use o mesmo idioma da mensagem. Não use aspas nem pontuação final.
            Responda apenas com o título, sem nenhum texto adicional.
            """)
    String generateTitle(@UserMessage String message);
}
