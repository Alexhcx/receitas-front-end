package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IngredienteRequestDTO(
        @NotBlank(message = "Nome do ingrediente é obrigatório.")
        @Size(max = 80, message = "Nome do ingrediente não pode exceder 80 caracteres.")
        String nomeIngrediente,

        @NotBlank(message = "Descrição do ingrediente é obrigatória.")
        @Size(max = 200, message = "Descrição do ingrediente não pode exceder 200 caracteres.")
        String descricaoIngrediente
) {}
