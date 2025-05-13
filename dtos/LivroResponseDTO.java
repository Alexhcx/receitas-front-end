package com.puc.bancodedados.receitas.dtos;

import java.util.Set;

public record LivroResponseDTO(
        String isbn,
        String titulo,
        Long editorRg,
        String nomeEditor,
        Set<ReceitaInfoDTO> receitas
) {}
