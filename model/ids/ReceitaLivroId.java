package com.puc.bancodedados.receitas.model.ids;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ReceitaLivroId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "isbn", length = 20)
    private String isbn;

    @Column(name = "receita_id")
    private Long receitaId;
}
