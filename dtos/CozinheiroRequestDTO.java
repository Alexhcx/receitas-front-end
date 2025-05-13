package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CozinheiroRequestDTO(
        @NotNull(message = "RG do cozinheiro (empregado) é obrigatório.")
        Long cozinheiroRg, // Este será o RG do Empregado

        @Size(max = 80, message = "Nome fantasia não pode exceder 80 caracteres.")
        String nomeFantasia,

        @NotNull(message = "Meta mensal de receitas é obrigatória.")
        @Min(value = 1, message = "Meta mensal de receitas deve ser no mínimo 1.")
        Integer metaMensalReceitas,

        @NotNull(message = "Prazo inicial em dias é obrigatório.")
        @Min(value = 0, message = "Prazo inicial não pode ser negativo.")
        @Max(value = 45, message = "Prazo inicial não pode exceder 45 dias.")
        Integer prazoInicialDias,

        LocalDate dtContrato
) {}
