package com.puc.bancodedados.receitas.dtos;

import java.time.LocalDate;

public record TesteResponseDTO(
        Long id,
        LocalDate dataTeste,
        Double nota,
        Long degustadorRg,
        String nomeDegustador,
        Long receitaId,
        String nomeReceita
) {}
