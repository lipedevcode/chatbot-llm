package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Session;
import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.repositories.HistoryRepository;
import com.chatbotllm.backend.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final SessionRepository sessionRepository;
    private final AuthService authService;

    @Transactional
    public History resolveHistory(Long historyId) {
        if (historyId == null) {
            return initializeHistoryWithSession();
        }
        return historyRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("History #" + historyId + " não encontrado"));
    }

    public HistoryDto getHistory(Long historyId) {
        History history = historyRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("History #" + historyId + " não encontrado"));
        return HistoryDto.fromHistory(historyId, history.getPrompts(), history.getSession());
    }

    public List<HistoryDto> getAllHistoriesByUser() {
        Usuario usuario = this.authService.getAuthenticatedUser();
        List<History> histories = historyRepository.findAllByUsuarioId(usuario.getId());
        return histories.stream()
                .sorted(Comparator.comparingLong(History::getId).reversed())
                .map(history -> HistoryDto.fromHistory(history.getId(), history.getPrompts(), history.getSession()))
                .toList();
    }

    private History initializeHistoryWithSession(){
        Session session = sessionRepository.save(new Session());
        History history = new History();
        history.setSession(session);
        history.setUsuario(this.authService.getAuthenticatedUser());
        return historyRepository.save(history);
    }

}
