package com.chatbotllm.backend.model;

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
    private Long memoryId;

    @Column(name= "messages", nullable = false, columnDefinition = "TEXT")
    private String messages;
}
