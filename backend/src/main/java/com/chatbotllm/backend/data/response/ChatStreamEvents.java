package com.chatbotllm.backend.data.response;

import com.chatbotllm.backend.data.dto.HistoryDto;

/**
 * Payloads (serializados em JSON) dos eventos SSE emitidos pelo endpoint de
 * streaming de mensagens do chat. Cada tipo corresponde a um nome de evento SSE:
 * <ul>
 *     <li>{@code meta}  — enviado uma vez, no início: id da conversa e título;</li>
 *     <li>{@code token} — enviado a cada fragmento de resposta da LLM;</li>
 *     <li>{@code done}  — enviado ao concluir, após persistir a interação: carrega
 *         o histórico já atualizado (com a interação e metadados dos anexos), para
 *         o cliente semear o cache sem um novo GET;</li>
 *     <li>{@code error} — enviado se a geração falhar.</li>
 * </ul>
 */
public final class ChatStreamEvents {

    private ChatStreamEvents() {
    }

    public record Meta(Long historyId, String title) {
    }

    public record Token(String text) {
    }

    public record Done(HistoryDto history) {
    }

    public record Error(String message) {
    }
}
