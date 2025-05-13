package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.IngredienteRequestDTO;
import com.puc.bancodedados.receitas.dtos.IngredienteResponseDTO;
import com.puc.bancodedados.receitas.services.IngredienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredientes")
public class IngredienteController {

    private final IngredienteService ingredienteService;

    @Autowired
    public IngredienteController(IngredienteService ingredienteService) {
        this.ingredienteService = ingredienteService;
    }

    @PostMapping
    public ResponseEntity<IngredienteResponseDTO> criarIngrediente(@Valid @RequestBody IngredienteRequestDTO requestDTO) {
        IngredienteResponseDTO novoIngrediente = ingredienteService.criarIngrediente(requestDTO);
        return new ResponseEntity<>(novoIngrediente, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IngredienteResponseDTO>> listarIngredientes() {
        List<IngredienteResponseDTO> ingredientes = ingredienteService.listarIngredientes();
        return ResponseEntity.ok(ingredientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredienteResponseDTO> buscarIngredientePorId(@PathVariable Long id) {
        IngredienteResponseDTO ingrediente = ingredienteService.buscarIngredientePorId(id);
        return ResponseEntity.ok(ingrediente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredienteResponseDTO> atualizarIngrediente(@PathVariable Long id, @Valid @RequestBody IngredienteRequestDTO requestDTO) {
        IngredienteResponseDTO ingredienteAtualizado = ingredienteService.atualizarIngrediente(id, requestDTO);
        return ResponseEntity.ok(ingredienteAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarIngrediente(@PathVariable Long id) {
        ingredienteService.deletarIngrediente(id);
        return ResponseEntity.noContent().build();
    }
}
