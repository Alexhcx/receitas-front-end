package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.DegustadorRequestDTO;
import com.puc.bancodedados.receitas.dtos.DegustadorResponseDTO;
import com.puc.bancodedados.receitas.services.DegustadorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/degustadores")
public class DegustadorController {

    private final DegustadorService degustadorService;

    @Autowired
    public DegustadorController(DegustadorService degustadorService) {
        this.degustadorService = degustadorService;
    }

    @PostMapping
    public ResponseEntity<DegustadorResponseDTO> criarDegustador(@Valid @RequestBody DegustadorRequestDTO requestDTO) {
        DegustadorResponseDTO novoDegustador = degustadorService.criarDegustador(requestDTO);
        return new ResponseEntity<>(novoDegustador, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DegustadorResponseDTO>> listarDegustadores() {
        List<DegustadorResponseDTO> degustadores = degustadorService.listarDegustadores();
        return ResponseEntity.ok(degustadores);
    }

    @GetMapping("/{rg}")
    public ResponseEntity<DegustadorResponseDTO> buscarDegustadorPorRg(@PathVariable Long rg) {
        DegustadorResponseDTO degustador = degustadorService.buscarDegustadorPorRg(rg);
        return ResponseEntity.ok(degustador);
    }

    @PutMapping("/{rg}")
    public ResponseEntity<DegustadorResponseDTO> atualizarDegustador(@PathVariable Long rg, @Valid @RequestBody DegustadorRequestDTO requestDTO) {
        DegustadorResponseDTO degustadorAtualizado = degustadorService.atualizarDegustador(rg, requestDTO);
        return ResponseEntity.ok(degustadorAtualizado);
    }

    @DeleteMapping("/{rg}")
    public ResponseEntity<Void> deletarDegustador(@PathVariable Long rg) {
        degustadorService.deletarDegustador(rg);
        return ResponseEntity.noContent().build();
    }
}
