package com.chatbotllm.backend.utils;

import com.chatbotllm.backend.model.Session;
import com.chatbotllm.backend.repositories.SessionRepository;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class PersistentChatMemoryStore implements ChatMemoryStore {

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
