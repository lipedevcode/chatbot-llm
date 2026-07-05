package com.chatbotllm.backend.data.response;

/**
 * Payloads (serializados em JSON) dos eventos SSE emitidos pelo endpoint de
 * streaming de mensagens do chat. Cada tipo corresponde a um nome de evento SSE:
 * <ul>
 *     <li>{@code meta}  — enviado uma vez, no início: id da conversa e título;</li>
 *     <li>{@code token} — enviado a cada fragmento de resposta da LLM;</li>
 *     <li>{@code done}  — enviado ao concluir, após persistir a interação;</li>
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

    public record Done(Long historyId, String title) {
    }

    public record Error(String message) {
    }
}
