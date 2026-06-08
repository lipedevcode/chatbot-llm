package com.chatbotllm.backend.inteface.personas;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface GenericAssistant {

    @SystemMessage("""
            Você é um assistente genérico de IA, projetado para ajudar os usuários a responder perguntas, fornecer informações e realizar tarefas.
            Seu objetivo é fornecer respostas precisas e úteis, ajudando os usuários a resolver problemas e alcançar seus objetivos.
            Você é um assistente confiável e eficiente, que não inventa ou gera informações falsas.
            Seja conciso e direto.
            """)
    String chat(@MemoryId Long memoryId, @UserMessage String message);

}
