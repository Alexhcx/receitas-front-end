package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.CozinheiroRequestDTO;
import com.puc.bancodedados.receitas.dtos.CozinheiroResponseDTO;
import com.puc.bancodedados.receitas.services.CozinheiroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cozinheiros")
public class CozinheiroController {

    private final CozinheiroService cozinheiroService;

    @Autowired
    public CozinheiroController(CozinheiroService cozinheiroService) {
        this.cozinheiroService = cozinheiroService;
    }

    @PostMapping
    public ResponseEntity<CozinheiroResponseDTO> criarCozinheiro(@Valid @RequestBody CozinheiroRequestDTO requestDTO) {
        CozinheiroResponseDTO novoCozinheiro = cozinheiroService.criarCozinheiro(requestDTO);
        return new ResponseEntity<>(novoCozinheiro, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CozinheiroResponseDTO>> listarCozinheiros() {
        List<CozinheiroResponseDTO> cozinheiros = cozinheiroService.listarCozinheiros();
        return ResponseEntity.ok(cozinheiros);
    }

    @GetMapping("/{rg}")
    public ResponseEntity<CozinheiroResponseDTO> buscarCozinheiroPorRg(@PathVariable Long rg) {
        CozinheiroResponseDTO cozinheiro = cozinheiroService.buscarCozinheiroPorRg(rg);
        return ResponseEntity.ok(cozinheiro);
    }

    @PutMapping("/{rg}")
    public ResponseEntity<CozinheiroResponseDTO> atualizarCozinheiro(@PathVariable Long rg, @Valid @RequestBody CozinheiroRequestDTO requestDTO) {
        CozinheiroResponseDTO cozinheiroAtualizado = cozinheiroService.atualizarCozinheiro(rg, requestDTO);
        return ResponseEntity.ok(cozinheiroAtualizado);
    }

    @DeleteMapping("/{rg}")
    public ResponseEntity<Void> deletarCozinheiro(@PathVariable Long rg) {
        cozinheiroService.deletarCozinheiro(rg);
        return ResponseEntity.noContent().build();
    }
}
