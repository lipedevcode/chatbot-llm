package com.chatbotllm.backend.data.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="text", columnDefinition = "TEXT")
    private String text;

    @OneToOne
    @JoinColumn(name="response_id")
    private Response response;

    @ManyToOne
    @JoinColumn(name="history_id")
    @JsonIgnore
    private History history;

    @ManyToOne
    @JoinColumn(name="usuario_id")
    private Usuario usuario;
}
