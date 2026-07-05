package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.data.dto.TitledResponse;
import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.data.model.History;
import com.chatbotllm.backend.data.model.Usuario;
import com.chatbotllm.backend.data.request.SendChatMessageRequest;
import com.chatbotllm.backend.data.response.ChatStreamEvents;
import com.chatbotllm.backend.data.response.SendChatMessageResponse;
import com.chatbotllm.backend.inteface.personas.ChatTitleAssistant;
import com.chatbotllm.backend.inteface.personas.GenericAssistant;
import com.chatbotllm.backend.inteface.personas.StreamingAssistant;
import com.chatbotllm.backend.inteface.personas.TitledAssistant;
import com.chatbotllm.backend.utils.PersistentChatMemoryStore;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.UserMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    // Timeout do SseEmitter: gera respostas de LLM podem levar dezenas de segundos;
    // sem um limite explícito valeria o default do container. 2 min é folgado o
    // bastante para respostas longas sem deixar conexões penduradas para sempre.
    private static final long STREAM_TIMEOUT_MS = 120_000L;

    private final HistoryService historyService;
    private final InteractionService interactionService;
    private final FileService fileService;
    private final GenericAssistant genericAssistant;
    private final TitledAssistant titledAssistant;
    private final StreamingAssistant streamingAssistant;
    private final ChatTitleAssistant chatTitleAssistant;
    private final ChatTitleService chatTitleService;
    private final AuthService authService;
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

    /**
     * Envia uma mensagem de texto e transmite a resposta da LLM token a token via
     * SSE. É o caminho usado pela página de conversa para exibir a resposta enquanto
     * ela é gerada. Anexos continuam pelo endpoint não-streaming (multipart).
     * <p>
     * O que roda na thread da requisição (com {@code SecurityContext} e OSIV): a
     * resolução do histórico, a geração do título da primeira mensagem e a captura
     * do usuário autenticado. Os callbacks do {@link dev.langchain4j.service.TokenStream}
     * rodam em thread de background — por isso a persistência recebe o usuário e o
     * id do histórico já resolvidos, sem depender de estado preso à thread.
     */
    public SseEmitter streamChatMessage(Long historyId, String userMessage) {
        History history = this.historyService.resolveHistory(historyId);

        if (history.getPrompts() == null) {
            history.setPrompts(new ArrayList<>());
        }

        Long resolvedHistoryId = history.getId();
        Long memoryId = history.getSession().getMemoryId();
        boolean firstMessage = isFirstMessage(history);

        // Na primeira mensagem gera-se um título curto ANTES do streaming, para
        // enviá-lo no evento inicial (meta). O título só é persistido ao concluir,
        // junto da interação. Em conversas já iniciadas, reaproveita o título atual.
        String title = firstMessage ? this.generateTitle(userMessage) : history.getTitle();
        String titleToPersist = firstMessage ? title : null;

        // Capturado na thread da requisição — os callbacks abaixo não têm acesso ao
        // SecurityContext.
        Usuario usuario = this.authService.getAuthenticatedUser();

        SseEmitter emitter = new SseEmitter(STREAM_TIMEOUT_MS);

        try {
            emitter.send(SseEmitter.event().name("meta").data(new ChatStreamEvents.Meta(resolvedHistoryId, title)));
        } catch (IOException e) {
            log.warn("Cliente desconectou antes de iniciar o streaming: {}", e.getMessage());
            emitter.completeWithError(e);
            return emitter;
        }

        StringBuilder answer = new StringBuilder();

        try {
            this.streamingAssistant.chat(memoryId, userMessage)
                    .onPartialResponse(token -> {
                        answer.append(token);
                        try {
                            emitter.send(SseEmitter.event().name("token").data(new ChatStreamEvents.Token(token)));
                        } catch (IOException e) {
                            log.warn("Cliente desconectou durante o streaming: {}", e.getMessage());
                            emitter.completeWithError(e);
                        }
                    })
                    .onCompleteResponse(response -> {
                        try {
                            // A memória da conversa é persistida automaticamente pelo langchain4j
                            // (mesmo ChatMemoryProvider); aqui persistimos a interação (prompt +
                            // resposta) e o título da primeira mensagem.
                            this.interactionService.saveStreamedInteraction(
                                    resolvedHistoryId, userMessage, answer.toString(), usuario, titleToPersist);
                            emitter.send(SseEmitter.event().name("done").data(new ChatStreamEvents.Done(resolvedHistoryId, title)));
                            emitter.complete();
                        } catch (Exception e) {
                            log.error("Erro ao finalizar o streaming do chat: {}", e.getMessage(), e);
                            emitter.completeWithError(e);
                        }
                    })
                    .onError(error -> {
                        log.error("Erro ao consultar o assistente de IA (streaming): {}", error.getMessage(), error);
                        this.sendErrorEvent(emitter);
                        emitter.completeWithError(error);
                    })
                    .start();
        } catch (Exception e) {
            // Falha síncrona ao montar/iniciar o stream (o meta já foi enviado):
            // sinaliza o erro ao cliente em vez de deixar a conexão SSE pendurada.
            log.error("Erro ao iniciar o streaming do chat: {}", e.getMessage(), e);
            this.sendErrorEvent(emitter);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    private void sendErrorEvent(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("error")
                    .data(new ChatStreamEvents.Error("Não foi possível obter resposta da IA no momento. Tente novamente.")));
        } catch (IOException ignored) {
            // Cliente pode já ter desconectado; nada a fazer além de encerrar.
        }
    }

    /**
     * Gera o título curto da conversa a partir da mensagem do usuário. Em caso de
     * falha na LLM, recorre ao fallback local ({@link ChatTitleService}), garantindo
     * que a conversa sempre receba um título.
     */
    private String generateTitle(String userMessage) {
        try {
            return this.chatTitleService.finalizeTitle(this.chatTitleAssistant.generateTitle(userMessage), userMessage);
        } catch (Exception e) {
            log.warn("Falha ao gerar título via LLM no streaming; usando fallback local.", e);
            return this.chatTitleService.finalizeTitle(null, userMessage);
        }
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
