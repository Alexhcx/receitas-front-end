package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

public record TesteRequestDTO(
        @NotNull(message = "Data do teste é obrigatória.")
        @PastOrPresent(message = "Data do teste não pode ser futura.")
        LocalDate dataTeste,

        @NotNull(message = "Nota é obrigatória.")
        @Min(value = 0, message = "Nota não pode ser menor que 0.")
        @Max(value = 10, message = "Nota não pode ser maior que 10.")
        Double nota,

        @NotNull(message = "RG do degustador é obrigatório.")
        Long degustadorRg,

        @NotNull(message = "ID da receita é obrigatório.")
        Long receitaId
) {}
