package com.chatbotllm.backend;

import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        String modelName = "gpt-4o-mini";
        OpenAiChatModel model = OpenAiChatModel.builder()
                .baseUrl("http://langchain4j.dev/demo/openai/v1")
                .modelName(modelName)
                .apiKey("demo")
                .build();
        String answer = model.chat("Diga, 'Olá UFPI'");
        System.out.println(answer);
    }
}
