package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RestauranteRequestDTO(
        @NotBlank(message = "Nome do restaurante é obrigatório.")
        @Size(max = 100, message = "Nome do restaurante não pode exceder 100 caracteres.")
        String nomeRestaurante,

        @NotNull(message = "RG do cozinheiro é obrigatório.")
        Long cozinheiroRg
) {}
