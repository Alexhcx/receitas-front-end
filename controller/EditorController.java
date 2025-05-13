package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.EditorRequestDTO;
import com.puc.bancodedados.receitas.dtos.EditorResponseDTO;
import com.puc.bancodedados.receitas.services.EditorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/editores")
public class EditorController {

    private final EditorService editorService;

    @Autowired
    public EditorController(EditorService editorService) {
        this.editorService = editorService;
    }

    @PostMapping
    public ResponseEntity<EditorResponseDTO> criarEditor(@Valid @RequestBody EditorRequestDTO requestDTO) {
        EditorResponseDTO novoEditor = editorService.criarEditor(requestDTO);
        return new ResponseEntity<>(novoEditor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EditorResponseDTO>> listarEditores() {
        List<EditorResponseDTO> editores = editorService.listarEditores();
        return ResponseEntity.ok(editores);
    }

    @GetMapping("/{rg}")
    public ResponseEntity<EditorResponseDTO> buscarEditorPorRg(@PathVariable Long rg) {
        EditorResponseDTO editor = editorService.buscarEditorPorRg(rg);
        return ResponseEntity.ok(editor);
    }

    @PutMapping("/{rg}")
    public ResponseEntity<EditorResponseDTO> atualizarEditor(@PathVariable Long rg, @Valid @RequestBody EditorRequestDTO requestDTO) {
        EditorResponseDTO editorAtualizado = editorService.atualizarEditor(rg, requestDTO);
        return ResponseEntity.ok(editorAtualizado);
    }

    @DeleteMapping("/{rg}")
    public ResponseEntity<Void> deletarEditor(@PathVariable Long rg) {
        editorService.deletarEditor(rg);
        return ResponseEntity.noContent().build();
    }
}
