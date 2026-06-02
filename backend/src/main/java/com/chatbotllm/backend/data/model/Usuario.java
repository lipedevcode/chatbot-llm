package com.chatbotllm.backend.data.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="history_id")
    private History history;

    @OneToMany(mappedBy = "usuario")
    private List<Prompt> prompts;

}
