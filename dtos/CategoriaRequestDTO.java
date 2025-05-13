package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
        @NotBlank(message = "Nome da categoria é obrigatório.")
        @Size(max = 80, message = "Nome da categoria não pode exceder 80 caracteres.")
        String nomeCategoria
) {
}
