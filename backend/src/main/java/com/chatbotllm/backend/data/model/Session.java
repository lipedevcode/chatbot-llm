package com.chatbotllm.backend.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Session {

    @Id
    @Column(name= "memory_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memoryId;

    @Column(name= "messages", columnDefinition = "TEXT")
    private String messages;
}
