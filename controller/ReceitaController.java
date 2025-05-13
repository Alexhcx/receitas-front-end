package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.ReceitaRequestDTO;
import com.puc.bancodedados.receitas.dtos.ReceitaResponseDTO;
import com.puc.bancodedados.receitas.services.ReceitaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    @Autowired
    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @PostMapping
    public ResponseEntity<ReceitaResponseDTO> criarReceita(@Valid @RequestBody ReceitaRequestDTO requestDTO) {
        ReceitaResponseDTO novaReceita = receitaService.criarReceita(requestDTO);
        return new ResponseEntity<>(novaReceita, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReceitaResponseDTO>> listarReceitas() {
        List<ReceitaResponseDTO> receitas = receitaService.listarReceitas();
        return ResponseEntity.ok(receitas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceitaResponseDTO> buscarReceitaPorId(@PathVariable Long id) {
        ReceitaResponseDTO receita = receitaService.buscarReceitaPorId(id);
        return ResponseEntity.ok(receita);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReceitaResponseDTO> atualizarReceita(@PathVariable Long id, @Valid @RequestBody ReceitaRequestDTO requestDTO) {
        ReceitaResponseDTO receitaAtualizada = receitaService.atualizarReceita(id, requestDTO);
        return ResponseEntity.ok(receitaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReceita(@PathVariable Long id) {
        receitaService.deletarReceita(id);
        return ResponseEntity.noContent().build();
    }
}
