package com.chatbotllm.backend.service;

import com.chatbotllm.backend.data.model.File;
import com.chatbotllm.backend.repositories.FileRepository;
import dev.langchain4j.data.message.ImageContent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
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
            PDDocument pdDocument = loadPdf(multipartFile);
            File file = File.builder()
                    .filename(multipartFile.getOriginalFilename())
                    .fileData(multipartFile.getBytes())
                    .text(extractTextFromFile(pdDocument, multipartFile.getOriginalFilename()))
                    .pagesBase64(renderizarTodasPaginasComoBase64(pdDocument, 150))
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
            PDDocument pdDocument = loadPdf(file);
            String extractedText = extractTextFromFile(pdDocument, file.getOriginalFilename());
            extractedTexts.add(extractedText);
        }
        return extractedTexts;
    }



    @SneakyThrows
    private String extractTextFromFile(PDDocument pdDocument, String filename) {
        try {
            String text = new PDFTextStripper().getText(pdDocument);
            return """
                    Título do documento anexado: %s
                    Conteúdo do documento: %s
                    """.formatted(filename, text);
        } catch (IOException e) {
            log.error("Erro ao ler bytes do arquivo PDF: {} - {}", filename, e.getMessage());
            throw new IOException("", e);
        }
    }

    @SneakyThrows
    public String renderizarPaginaComoBase64(PDDocument document, int numeroPagina, float dpi) {
        PDFRenderer renderer = new PDFRenderer(document);
        BufferedImage image = renderer.renderImageWithDPI(numeroPagina, dpi);

        var baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();

        return Base64.getEncoder().encodeToString(imageBytes);
    }

    public List<String> renderizarTodasPaginasComoBase64(PDDocument document, float dpi) {
        List<String> base64Pages = new ArrayList<>();
        int totalPages = document.getNumberOfPages();

        for (int i = 0; i < totalPages; i++) {
            String base64Page = renderizarPaginaComoBase64(document, i, dpi);
            base64Pages.add(base64Page);
        }

        return base64Pages;
    }

    public List<ImageContent> getPagesImagesFromFiles(List<File> files) {
        List<ImageContent> pagesPdf = new ArrayList<>();
        for (File file : files) {
            if (file.getPagesBase64().isEmpty()) continue;
            pagesPdf.addAll(getPagesImagesFromFile(file));
        }
        return pagesPdf;
    }

    private List<ImageContent> getPagesImagesFromFile(File file) {
        List<ImageContent> pagesPdf = new ArrayList<>();
        for (String pageBase64 : file.getPagesBase64()) {
            ImageContent imageContent = ImageContent.from(pageBase64, "image/png");
            pagesPdf.add(imageContent);
        }
        return pagesPdf;
    }

    private PDDocument loadPdf(MultipartFile file) {
        try {
            byte[] pdfBytes = file.getBytes();
            return loadPDF(pdfBytes);
        } catch (IOException e) {
            log.error("Erro ao carregar arquivo PDF: {} - {}", file.getOriginalFilename(), e.getMessage());
            throw new RuntimeException("Erro ao carregar arquivo PDF", e);
        }
    }
}
