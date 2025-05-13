package com.puc.bancodedados.receitas.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmpregadoResponseDTO(
        Long empregadoRg,
        String nomeEmpregado,
        LocalDate dataAdmissao,
        BigDecimal salario
) {}
