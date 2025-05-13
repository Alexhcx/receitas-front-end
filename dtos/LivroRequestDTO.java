package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LivroRequestDTO(
        @NotBlank(message = "ISBN é obrigatório.")
        @Size(max = 20, message = "ISBN não pode exceder 20 caracteres.")
        String isbn,

        @NotBlank(message = "Título é obrigatório.")
        @Size(max = 100, message = "Título não pode exceder 100 caracteres.")
        String titulo,

        @NotNull(message = "RG do editor é obrigatório.")
        Long editorRg
) {}
