package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.repositories.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.apache.pdfbox.Loader.loadPDF;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    public File retrieve(UUID id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found with id: " + id));
    }

    @SneakyThrows
    public File createFromMultipartFile(MultipartFile multipartFile) {
        try {
            File file = File.builder()
                    .filename(multipartFile.getOriginalFilename())
                    .fileData(multipartFile.getBytes())
                    .text(extractTextFromFile(multipartFile))
                    .build();
            return fileRepository.save(file);
        } catch (IOException e) {
            log.error("Erro ao ler bytes do arquivo PDF: {} - {}", multipartFile.getOriginalFilename(), e.getMessage());
            throw new IOException("", e);
        }
    }

    @Transactional
    public List<File> createFromMultipartFiles(List<MultipartFile> multipartFiles) {
        List<File> files = new ArrayList<>();

        for (MultipartFile multipartFile : multipartFiles) {
            files.add(createFromMultipartFile(multipartFile));
        }

        return files;
    }

    public List<String> getTextsFromFiles(List<File> files) {
        List<String> texts = new ArrayList<>();
        for (File file : files) {
            texts.add(file.getText());
        }
        return texts;
    }


    @SneakyThrows
    private List<String> extractTextFromFiles(List<MultipartFile> files) {
        List<String> extractedTexts = new ArrayList<>();
        for (MultipartFile file : files){
            String extractedText = extractTextFromFile(file);
            extractedTexts.add(extractedText);
        }
        return extractedTexts;
    }

    @SneakyThrows
    private String extractTextFromFile(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            try (PDDocument pdDocument = loadPDF(fileBytes)) {
                String text = new PDFTextStripper().getText(pdDocument);
                return """
                        Título do documento anexado: %s
                        Conteúdo do documento: %s
                        """.formatted(file.getOriginalFilename(), text);
            } catch (IOException e) {
                log.error("Erro ao extrair texto do arquivo PDF: {} - {}", file.getOriginalFilename(), e.getMessage());
                throw new IOException("", e);
            }
        } catch (IOException e) {
            log.error("Erro ao ler bytes do arquivo PDF: {} - {}", file.getOriginalFilename(), e.getMessage());
            throw new IOException("", e);
        }
    }
}
