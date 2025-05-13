package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ReceitaIngredienteItemDTO(
        @NotNull(message = "ID do ingrediente é obrigatório.")
        Long ingredienteId,

        @NotNull(message = "Quantidade é obrigatória.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Quantidade deve ser maior que zero.")
        BigDecimal quantidade,

        @Size(max = 50, message = "Medida não pode exceder 50 caracteres.")
        String medida
) {}
