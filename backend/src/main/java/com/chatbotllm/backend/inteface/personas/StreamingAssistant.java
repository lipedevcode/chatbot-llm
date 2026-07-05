package com.chatbotllm.backend.inteface.personas;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.UserMessage;

/**
 * Variante de streaming do {@link GenericAssistant}: em vez de devolver a resposta
 * completa de uma vez, retorna um {@link TokenStream} cujos tokens são emitidos
 * incrementalmente e repassados ao cliente via SSE.
 * <p>
 * Compartilha a mesma memória de chat (via {@code @MemoryId} e o mesmo
 * {@code ChatMemoryProvider}) que o {@link GenericAssistant}, de modo que a conversa
 * mantém contexto independentemente do fluxo — streaming ou não — usado em cada
 * mensagem. Ao concluir o streaming, o langchain4j persiste automaticamente o par
 * (mensagem do usuário, resposta) na memória da sessão.
 */
public interface StreamingAssistant {

    @SystemMessage("""
            Você é um assistente genérico de IA, projetado para ajudar os usuários a responder perguntas, fornecer informações e realizar tarefas.
            Seu objetivo é fornecer respostas precisas e úteis, ajudando os usuários a resolver problemas e alcançar seus objetivos.
            Você é um assistente confiável e eficiente, que não inventa ou gera informações falsas.
            Seja conciso e direto.
            """)
    TokenStream chat(@MemoryId Long memoryId, @UserMessage String message);
}
