package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.EmpregadoRequestDTO;
import com.puc.bancodedados.receitas.dtos.EmpregadoResponseDTO;
import com.puc.bancodedados.receitas.services.EmpregadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empregados")
public class EmpregadoController {

    private final EmpregadoService empregadoService;

    @Autowired
    public EmpregadoController(EmpregadoService empregadoService) {
        this.empregadoService = empregadoService;
    }

    @PostMapping
    public ResponseEntity<EmpregadoResponseDTO> criarEmpregado(@Valid @RequestBody EmpregadoRequestDTO requestDTO) {
        EmpregadoResponseDTO novoEmpregado = empregadoService.criarEmpregado(requestDTO);
        return new ResponseEntity<>(novoEmpregado, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmpregadoResponseDTO>> listarEmpregados() {
        List<EmpregadoResponseDTO> empregados = empregadoService.listarEmpregados();
        return ResponseEntity.ok(empregados);
    }

    @GetMapping("/{rg}")
    public ResponseEntity<EmpregadoResponseDTO> buscarEmpregadoPorRg(@PathVariable Long rg) {
        EmpregadoResponseDTO empregado = empregadoService.buscarEmpregadoPorRg(rg);
        return ResponseEntity.ok(empregado);
    }

    @PutMapping("/{rg}")
    public ResponseEntity<EmpregadoResponseDTO> atualizarEmpregado(@PathVariable Long rg, @Valid @RequestBody EmpregadoRequestDTO requestDTO) {
        EmpregadoResponseDTO empregadoAtualizado = empregadoService.atualizarEmpregado(rg, requestDTO);
        return ResponseEntity.ok(empregadoAtualizado);
    }

    @DeleteMapping("/{rg}")
    public ResponseEntity<Void> deletarEmpregado(@PathVariable Long rg) {
        empregadoService.deletarEmpregado(rg);
        return ResponseEntity.noContent().build();
    }
}
