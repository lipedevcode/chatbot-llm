package com.chatbotllm.backend.config;

import com.chatbotllm.backend.inteface.personas.ChatTitleGenerator;
import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import com.chatbotllm.backend.repositories.SessionRepository;
import com.chatbotllm.backend.utils.PersistentChatMemoryStore;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class GenericAssistantConfig {

    @Value("${gemini.api.key}")
    private String GEMINI_API_KEY;

    @Value("${gemini.openai.url}")
    private String GEMINI_OPEN_AI_URL;

    @Value("${max.messages.window}")
    private Integer MAX_MESSAGES_WINDOW;

    private final SessionRepository sessionRepository;

    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(MAX_MESSAGES_WINDOW)
                .alwaysKeepSystemMessageFirst(true)
                .chatMemoryStore(new PersistentChatMemoryStore(sessionRepository))
                .build();
    }

    @Bean
    public ChatModel chatModel(){
        return OpenAiChatModel.builder()
                .baseUrl(GEMINI_OPEN_AI_URL)
                .apiKey(GEMINI_API_KEY)
                .modelName("gemini-3.1-flash-lite")
                .build();
    }

    @Bean
    public GenericAssistant assistant(ChatModel model, ChatMemoryProvider chatMemoryProvider){
        return AiServices.builder(GenericAssistant.class)
                .chatModel(model)
                .chatMemoryProvider(chatMemoryProvider)
                .build();
    }

    @Bean
    public ChatTitleGenerator chatTitleGenerator(ChatModel model){
        // Sem chatMemoryProvider: geração de título é stateless e não afeta a memória da conversa.
        return AiServices.create(ChatTitleGenerator.class, model);
    }


}