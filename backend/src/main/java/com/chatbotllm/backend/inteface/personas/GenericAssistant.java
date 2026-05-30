package com.chatbotllm.backend.inteface.personas;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface GenericAssistant {

    @SystemMessage("Você é um assistente genérico")
    String chat(@MemoryId Long memoryId, @UserMessage String message);

}
