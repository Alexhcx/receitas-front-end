package com.puc.bancodedados.receitas.dtos;

import java.time.LocalDate;
import java.util.Set;

public record ReceitaResponseDTO(
        Long id,
        String nomeReceita,
        String descricaoModoPreparo,
        LocalDate dataCriacao,
        Integer numeroPorcoes,
        Long cozinheiroRg,
        String nomeCozinheiro,
        Long categoriaId,
        String nomeCategoria,
        Set<ReceitaIngredienteItemDTO> ingredientes
) {}
