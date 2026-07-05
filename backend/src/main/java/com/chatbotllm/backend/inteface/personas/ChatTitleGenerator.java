package com.chatbotllm.backend.inteface.personas;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Gera um título curto para uma conversa a partir da primeira mensagem do usuário.
 * Diferente do {@link GenericAssistant}, este serviço é stateless (sem memória de chat),
 * para não poluir o histórico da conversa com o prompt de geração de título.
 */
public interface ChatTitleGenerator {

    @SystemMessage("""
            Você gera títulos curtos para conversas de um chat.
            A partir da primeira mensagem do usuário, gere um título objetivo com no máximo 5 palavras
            que resuma o assunto da conversa.
            Responda APENAS com o título, no mesmo idioma da mensagem do usuário.
            Não use aspas, não use pontuação final e não adicione prefixos como "Título:".
            """)
    String generateTitle(@UserMessage String userMessage);
}
