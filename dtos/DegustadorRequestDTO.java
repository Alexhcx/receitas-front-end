package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DegustadorRequestDTO(
        @NotNull(message = "RG do degustador (empregado) é obrigatório.")
        Long degustadorRg, // RG do Empregado

        LocalDate dtContrato
) {}
