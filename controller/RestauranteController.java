package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.RestauranteRequestDTO;
import com.puc.bancodedados.receitas.dtos.RestauranteResponseDTO;
import com.puc.bancodedados.receitas.services.RestauranteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    private final RestauranteService restauranteService;

    @Autowired
    public RestauranteController(RestauranteService restauranteService) {
        this.restauranteService = restauranteService;
    }

    @PostMapping
    public ResponseEntity<RestauranteResponseDTO> criarRestaurante(@Valid @RequestBody RestauranteRequestDTO requestDTO) {
        RestauranteResponseDTO novoRestaurante = restauranteService.criarRestaurante(requestDTO);
        return new ResponseEntity<>(novoRestaurante, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RestauranteResponseDTO>> listarRestaurantes() {
        List<RestauranteResponseDTO> restaurantes = restauranteService.listarRestaurantes();
        return ResponseEntity.ok(restaurantes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestauranteResponseDTO> buscarRestaurantePorId(@PathVariable Long id) {
        RestauranteResponseDTO restaurante = restauranteService.buscarRestaurantePorId(id);
        return ResponseEntity.ok(restaurante);
    }

    @GetMapping("/cozinheiro/{cozinheiroRg}")
    public ResponseEntity<List<RestauranteResponseDTO>> listarRestaurantesPorCozinheiro(@PathVariable Long cozinheiroRg) {
        List<RestauranteResponseDTO> restaurantes = restauranteService.listarRestaurantesPorCozinheiro(cozinheiroRg);
        return ResponseEntity.ok(restaurantes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestauranteResponseDTO> atualizarRestaurante(@PathVariable Long id, @Valid @RequestBody RestauranteRequestDTO requestDTO) {
        RestauranteResponseDTO restauranteAtualizado = restauranteService.atualizarRestaurante(id, requestDTO);
        return ResponseEntity.ok(restauranteAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRestaurante(@PathVariable Long id) {
        restauranteService.deletarRestaurante(id);
        return ResponseEntity.noContent().build();
    }
}
