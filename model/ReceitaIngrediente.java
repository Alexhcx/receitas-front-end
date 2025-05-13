package com.puc.bancodedados.receitas.model;

import com.puc.bancodedados.receitas.model.ids.ReceitaIngredienteId;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "receita_ingrediente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"receita", "ingrediente"})
public class ReceitaIngrediente {

    @EmbeddedId
    private ReceitaIngredienteId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("receitaId")
    @JoinColumn(name = "receita_id", insertable = false, updatable = false)
    private Receita receita;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("ingredienteId")
    @JoinColumn(name = "ingrediente_id", insertable = false, updatable = false)
    private Ingrediente ingrediente;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false, message = "Quantidade deve ser maior que zero")
    @Column(name = "quantidade", nullable = false)
    private BigDecimal quantidade;

    @Column(name = "medida", length = 50)
    private String medida;
}
