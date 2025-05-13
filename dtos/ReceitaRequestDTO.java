package com.puc.bancodedados.receitas.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record ReceitaRequestDTO(
        @NotBlank(message = "Nome da receita é obrigatório.")
        @Size(max = 80, message = "Nome da receita não pode exceder 80 caracteres.")
        String nomeReceita,

        @NotBlank(message = "Descrição do modo de preparo é obrigatória.")
        String descricaoModoPreparo, // @Lob será na entidade

        @NotNull(message = "Data de criação é obrigatória.")
        @PastOrPresent(message = "Data de criação não pode ser futura.")
        LocalDate dataCriacao,

        @NotNull(message = "Número de porções é obrigatório.")
        @Min(value = 1, message = "Número de porções deve ser no mínimo 1.")
        Integer numeroPorcoes,

        @NotNull(message = "RG do cozinheiro é obrigatório.")
        Long cozinheiroRg,

        @NotNull(message = "ID da categoria é obrigatório.")
        Long categoriaId,

        @Valid
        Set<ReceitaIngredienteItemDTO> ingredientes
) {}
