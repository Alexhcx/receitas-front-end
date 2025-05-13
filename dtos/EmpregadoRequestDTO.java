package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmpregadoRequestDTO(
        @NotNull(message = "RG do empregado é obrigatório.")
        Long empregadoRg,

        @NotBlank(message = "Nome do empregado é obrigatório.")
        String nomeEmpregado,

        @NotNull(message = "Data de admissão é obrigatória.")
        @PastOrPresent(message = "Data de admissão não pode ser futura.")
        LocalDate dataAdmissao,

        @NotNull(message = "Salário é obrigatório.")
        @DecimalMin(value = "0.01", message = "Salário deve ser maior que zero.")
        BigDecimal salario
) {}
