package com.chatbotllm.backend;

import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import com.chatbotllm.backend.model.Session;
import com.chatbotllm.backend.repository.SessionRepository;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

        Optional<Session> session1 = sessionRepository.findByMemoryId(1L);
        if (session1.isEmpty()) sessionRepository.save(new Session(1L, ""));
        Optional<Session> session2 = sessionRepository.findByMemoryId(2L);
        if (session2.isEmpty()) sessionRepository.save(new Session(2L, ""));
        System.out.println(genericAssistant.chat(1L, "What is my name?"));
        System.out.println(genericAssistant.chat(2L, "What is my name?"));

        return "";
    }
}
class PersistentChatMemoryStore implements ChatMemoryStore {

    private final SessionRepository sessionRepository;


    public PersistentChatMemoryStore(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessage> getMessages(Object memoryId) {
        Session session = sessionRepository.findById((Long) memoryId).orElseThrow(
                () -> new RuntimeException("Erro: session_id #" + memoryId + " não encontrado")
        );
        String messages = session.getMessages();
        if (messages == null || messages.isBlank()) return List.of();
        return ChatMessageDeserializer.messagesFromJson(messages);
    }

    @Override
    @Transactional
    public void updateMessages(Object memoryId, List<ChatMessage> messages) {
        Session session = sessionRepository.findById((Long) memoryId).orElseThrow(
                () -> new RuntimeException("Erro: session_id #" + memoryId + " não encontrado")
        );
        String messagesToJson = ChatMessageSerializer.messagesToJson(messages);
        session.setMessages(messagesToJson);
        sessionRepository.save(session);
    }

    @Override
    @Transactional
    public void deleteMessages(Object memoryId) {
        Session session = sessionRepository.findById((Long) memoryId).orElseThrow(
                () -> new RuntimeException("Erro: session_id #" + memoryId + " não encontrado")
        );
        sessionRepository.delete(session);
    }
}