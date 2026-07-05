package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.dto.HistoryDto;
import com.chatbotllm.backend.service.HistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HistoryControllerTest {

    @Mock
    private HistoryService historyService;

    private HistoryController historyController;

    @BeforeEach
    void setUp() {
        historyController = new HistoryController(historyService);
    }

    @Test
    void getHistoryShouldReturnHistoryDto() {
        HistoryDto historyDto = new HistoryDto(1L, List.of());
        when(historyService.getHistory(1L)).thenReturn(historyDto);

        ResponseEntity<Object> response = historyController.getHistory(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(historyDto, response.getBody());
        assertNotNull(response.getBody());
        verify(historyService).getHistory(1L);
    }

    @Test
    void getAllHistoriesByUserShouldReturnAllHistories() {
        List<HistoryDto> histories = List.of(new HistoryDto(1L, List.of()));
        when(historyService.getAllHistoriesByUser()).thenReturn(histories);

        ResponseEntity<Object> response = historyController.getAllHistoriesByUser();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(histories, response.getBody());
        assertNotNull(response.getBody());
        verify(historyService).getAllHistoriesByUser();
    }
}

