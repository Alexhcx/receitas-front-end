package com.puc.bancodedados.receitas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "teste")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"degustador", "receita"})
public class Teste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teste_id")
    private Long id;

    @NotNull
    @PastOrPresent
    @Column(name = "data_teste", nullable = false)
    private LocalDate dataTeste;

    @NotNull
    @Min(value = 0, message = "Nota não pode ser menor que 0")
    @Max(value = 10, message = "Nota não pode ser maior que 10")
    @Column(name = "nota", nullable = false)
    private Double nota; // Ou Integer se a nota for sempre inteira

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "degustador_rg", nullable = false)
    private Degustador degustador;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receita_id", nullable = false)
    private Receita receita;
}
