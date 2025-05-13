package com.puc.bancodedados.receitas.dtos;

public record RestauranteResponseDTO(
        Long id,
        String nomeRestaurante,
        Long cozinheiroRg,
        String nomeCozinheiro
) {}
