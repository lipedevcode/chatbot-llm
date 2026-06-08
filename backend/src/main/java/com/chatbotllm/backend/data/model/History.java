package com.chatbotllm.backend.data.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @OneToMany(mappedBy = "history", fetch = FetchType.LAZY)
    private List<Prompt> prompts;

    @OneToOne
    @JoinColumn(name="session_id", nullable=false)
    private Session session;

    @ManyToOne
    @JoinColumn(name="usuario_id")
    private Usuario usuario;
}
