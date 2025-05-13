package com.puc.bancodedados.receitas.dtos;

import java.time.LocalDate;

public record DegustadorResponseDTO(
        Long degustadorRg,
        String nomeEmpregado, // Adicionado para conveniência
        LocalDate dtContrato
) {}
