package com.chatbotllm.backend.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name="filename")
    private String filename;

    @Column(name="file_data")
    @JdbcTypeCode(SqlTypes.BINARY)
    private byte[] fileData;

    @Column(name="text", columnDefinition = "TEXT")
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id")
    private Prompt prompt;

    @ElementCollection
    @CollectionTable(
            name = "documento_base64",
            joinColumns = @JoinColumn(name = "documento_id")
    )
    @Column(name = "conteudo", columnDefinition = "TEXT")
    private List<String> pagesBase64 = new ArrayList<>();
}
