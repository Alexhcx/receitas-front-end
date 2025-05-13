package com.puc.bancodedados.receitas.dtos;

import java.time.LocalDate;

public record CozinheiroResponseDTO(
        Long cozinheiroRg,
        String nomeEmpregado,
        String nomeFantasia,
        Integer metaMensalReceitas,
        Integer prazoInicialDias,
        LocalDate dtContrato
) {}
