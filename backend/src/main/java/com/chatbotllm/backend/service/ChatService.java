package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.dto.TitledResponse;
import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import com.chatbotllm.backend.inteface.personas.TitledAssistant;
import com.chatbotllm.backend.utils.PersistentChatMemoryStore;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.UserMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ChatService {

    private final HistoryService historyService;
    private final InteractionService interactionService;
    private final FileService fileService;
    private final GenericAssistant genericAssistant;
    private final TitledAssistant titledAssistant;
    private final ChatTitleService chatTitleService;
    private final PersistentChatMemoryStore chatMemoryStore;

    public SendChatMessageResponse sendChatMessage(SendChatMessageRequest sendChatMessageRequest) {
        return this.sendChatMessage(sendChatMessageRequest.getHistoryId(), sendChatMessageRequest.getUserMessage());
    }

    public SendChatMessageResponse sendChatMessage(Long historyId, String userMessage){
        History history = this.historyService.resolveHistory(historyId);

        if (history.getPrompts() == null){
            history.setPrompts(new ArrayList<>());
            }

        Long sessionMemoryId = history.getSession().getMemoryId();

        String aiMessage = isFirstMessage(history)
                ? this.chatAndGenerateTitle(history, sessionMemoryId, userMessage, userMessage, null)
                : genericAssistant.chat(sessionMemoryId, userMessage);

        this.interactionService.saveInteraction(userMessage, aiMessage, history);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getTitle(), history.getPrompts()))
                .build();
    }

    public SendChatMessageResponse sendChatMessage(Long historyId, String userMessage, List<MultipartFile> multipartFiles){
        History history = this.historyService.resolveHistory(historyId);

        if (history.getPrompts() == null) {
            history.setPrompts(new ArrayList<>());
        }

        Long sessionMemoryId = history.getSession().getMemoryId();

        List<File> files = this.fileService.createFromMultipartFiles(multipartFiles);

        List<String> extractedTexts = this.fileService.getTextsFromFiles(files);

        List<ImageContent> pagesPdf = this.fileService.getPagesImagesFromFiles(files);

        String userMessageWithFiles = String.join("\n\n", extractedTexts) +  "\n\n" + "## Prompt do usuário: " + userMessage;

        // Na primeira mensagem o título considera o conteúdo do anexo (userMessageWithFiles),
        // mas o fallback usa apenas a mensagem crua, para não expor o conteúdo do documento.
        String aiMessage = isFirstMessage(history)
                ? this.chatAndGenerateTitle(history, sessionMemoryId, userMessageWithFiles, userMessage, pagesPdf)
                : genericAssistant.chat(sessionMemoryId, userMessageWithFiles, pagesPdf);

        this.interactionService.saveInteraction(userMessageWithFiles, aiMessage, history, files);

        return SendChatMessageResponse.builder()
                .aiMessage(aiMessage)
                .history(HistoryDto.fromHistory(history.getId(), history.getTitle(), history.getPrompts()))
                .build();
    }

    // Isola falhas do provedor de LLM (timeout, rate-limit, resposta inválida) com
    // uma mensagem clara. Continua virando 500 (é uma falha de serviço externo,
    // não do cliente), mas com corpo estruturado em vez do whitelabel do Spring.
    private String askAssistant(java.util.function.Supplier<String> call) {
        try {
            return call.get();
        } catch (RuntimeException e) {
            log.error("Erro ao consultar o assistente de IA: {}", e.getMessage(), e);
            throw new RuntimeException("Não foi possível obter resposta da IA no momento. Tente novamente.", e);
        }
    }

    private boolean isFirstMessage(History history) {
        boolean semTitulo = history.getTitle() == null || history.getTitle().isBlank();
        return semTitulo && history.getPrompts().isEmpty();
    }

    /**
     * Primeira mensagem de uma conversa: obtém a resposta e o título do chat em uma
     * única chamada à LLM (via {@link TitledAssistant}), define o título e semeia a
     * memória do chat com a resposta em texto limpo, para que as próximas mensagens
     * tenham contexto sem que o JSON estruturado polua a memória.
     * <p>
     * Se a geração estruturada falhar, recorre ao fluxo padrão com memória — que
     * também é uma única chamada — e deriva o título localmente a partir da mensagem.
     *
     * @param llmMessage    texto enviado à LLM (pode incluir o conteúdo dos anexos)
     * @param titleFallback fonte do título de fallback (mensagem crua do usuário)
     * @param images        páginas de PDF como imagens, ou {@code null} quando não há anexo
     */
    private String chatAndGenerateTitle(History history, Long memoryId, String llmMessage, String titleFallback, List<ImageContent> images) {
        try {
            TitledResponse result = images == null
                    ? titledAssistant.chat(llmMessage)
                    : titledAssistant.chat(llmMessage, images);

            String answer = result.answer() == null ? "" : result.answer();
            history.setTitle(this.chatTitleService.finalizeTitle(result.title(), titleFallback));
            this.seedMemory(memoryId, llmMessage, answer);
            return answer;
        } catch (Exception e) {
            log.warn("Falha na geração combinada de título+resposta; usando fluxo padrão.", e);
            String answer = images == null
                    ? genericAssistant.chat(memoryId, llmMessage)
                    : genericAssistant.chat(memoryId, llmMessage, images);
            history.setTitle(this.chatTitleService.finalizeTitle(null, titleFallback));
            return answer;
        }
    }

    /**
     * Semeia a memória do chat com o par (mensagem do usuário, resposta) em texto
     * limpo. Como é a primeira interação, a memória estava vazia; a mensagem de
     * sistema é adicionada pelo assistente com memória na próxima chamada.
     */
    private void seedMemory(Long memoryId, String userText, String answer) {
        this.chatMemoryStore.updateMessages(memoryId, List.of(
                UserMessage.from(userText),
                AiMessage.from(answer)
        ));
    }
}
