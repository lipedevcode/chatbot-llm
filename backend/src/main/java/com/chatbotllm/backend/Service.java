package com.chatbotllm.backend;

import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import com.chatbotllm.backend.model.Session;
import com.chatbotllm.backend.repositories.SessionRepository;
import com.chatbotllm.backend.utils.PersistentChatMemoryStore;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import static dev.langchain4j.model.openai.OpenAiChatModelName.GPT_4_O_MINI;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class Service {

    private final Integer MAX_MESSAGES_WINDOW = 10;

    private final SessionRepository sessionRepository;

    public String chat(Long id, String userMessage) {
        ChatMemoryProvider chatMemoryProvider = memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(MAX_MESSAGES_WINDOW)
                .chatMemoryStore(new PersistentChatMemoryStore(sessionRepository))
                .build();

        ChatModel model = OpenAiChatModel.builder()
                .baseUrl("http://langchain4j.dev/demo/openai/v1")
                .apiKey("demo")
                .modelName(GPT_4_O_MINI)
                .build();

        GenericAssistant genericAssistant = AiServices.builder(GenericAssistant.class)
                .chatModel(model)
                .chatMemoryProvider(chatMemoryProvider)
                .build();

        this.createSessionIfNotExists(id);

        return genericAssistant.chat(id, userMessage);
    }

    private void createSessionIfNotExists(Long memoryId) {
        Optional<Session> sessionOptional = sessionRepository.findByMemoryId(memoryId);
        if (sessionOptional.isEmpty()) {
            Session session = new Session();
            session.setMemoryId(memoryId);
            session.setMessages("");
            sessionRepository.save(session);
        }
    }
}