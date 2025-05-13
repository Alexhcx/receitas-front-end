package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.TesteRequestDTO;
import com.puc.bancodedados.receitas.dtos.TesteResponseDTO;
import com.puc.bancodedados.receitas.services.TesteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testes")
public class TesteController {

    private final TesteService testeService;

    @Autowired
    public TesteController(TesteService testeService) {
        this.testeService = testeService;
    }

    @PostMapping
    public ResponseEntity<TesteResponseDTO> criarTeste(@Valid @RequestBody TesteRequestDTO requestDTO) {
        TesteResponseDTO novoTeste = testeService.criarTeste(requestDTO);
        return new ResponseEntity<>(novoTeste, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TesteResponseDTO>> listarTestes() {
        List<TesteResponseDTO> testes = testeService.listarTestes();
        return ResponseEntity.ok(testes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TesteResponseDTO> buscarTestePorId(@PathVariable Long id) {
        TesteResponseDTO teste = testeService.buscarTestePorId(id);
        return ResponseEntity.ok(teste);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TesteResponseDTO> atualizarTeste(@PathVariable Long id, @Valid @RequestBody TesteRequestDTO requestDTO) {
        TesteResponseDTO testeAtualizado = testeService.atualizarTeste(id, requestDTO);
        return ResponseEntity.ok(testeAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTeste(@PathVariable Long id) {
        testeService.deletarTeste(id);
        return ResponseEntity.noContent().build();
    }
}
