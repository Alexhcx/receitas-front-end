package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssociarReceitaLivroRequestDTO(
        @NotBlank(message = "ISBN do livro é obrigatório.")
        String isbn,
        @NotNull(message = "ID da receita é obrigatório.")
        Long receitaId
) {}
