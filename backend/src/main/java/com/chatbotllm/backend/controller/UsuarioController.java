package com.chatbotllm.backend.controller;

import com.chatbotllm.backend.data.request.AtualizarPerfilRequest;
import com.chatbotllm.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<Object> getPerfil() {
        return ResponseEntity
                .ok()
                .body(this.usuarioService.getPerfil());
    }

    @PutMapping("/me")
    public ResponseEntity<Object> atualizarPerfil(@Valid @RequestBody AtualizarPerfilRequest atualizarPerfilRequest) {
        return ResponseEntity
                .ok()
                .body(this.usuarioService.atualizarPerfil(atualizarPerfilRequest));
    }
}
