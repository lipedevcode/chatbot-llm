package com.chatbotllm.backend.inteface.personas;

import com.chatbotllm.backend.data.dto.TitledResponse;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

import java.util.List;

/**
 * Assistente usado apenas na primeira mensagem de uma conversa. Diferente do
 * {@link GenericAssistant}, é stateless (sem memória de chat) e retorna uma
 * resposta estruturada com a resposta ao usuário e o título do chat, de modo que
 * ambos sejam produzidos em uma única chamada à LLM.
 */
public interface TitledAssistant {

    @SystemMessage("""
            Você é um assistente genérico de IA, projetado para ajudar os usuários a responder perguntas, fornecer informações e realizar tarefas.
            Seu objetivo é fornecer respostas precisas e úteis, ajudando os usuários a resolver problemas e alcançar seus objetivos.
            Você é um assistente confiável e eficiente, que não inventa ou gera informações falsas.
            Seja conciso e direto.
            Além de responder, gere um título curto que resuma o assunto da conversa.
            """)
    TitledResponse chat(@UserMessage String message);

    @SystemMessage("""
            Você é um assistente genérico de IA, projetado para ajudar os usuários a responder perguntas, fornecer informações e realizar tarefas.
            Seu objetivo é fornecer respostas precisas e úteis, ajudando os usuários a resolver problemas e alcançar seus objetivos.
            Você é um assistente confiável e eficiente, que não inventa ou gera informações falsas.
            Seja conciso e direto.
            Além de responder, gere um título curto que resuma o assunto da conversa.
            """)
    TitledResponse chat(@UserMessage String message, @UserMessage List<ImageContent> images);
}
