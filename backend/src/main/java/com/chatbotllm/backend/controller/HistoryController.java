package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("{id}")
    public ResponseEntity<Object> getHistory(@PathVariable Long id) {
        return ResponseEntity
                .ok()
                .body(this.historyService.getHistory(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllHistories() {
        return ResponseEntity
                .ok()
                .body(this.historyService.getAllHistories());
    }
}
