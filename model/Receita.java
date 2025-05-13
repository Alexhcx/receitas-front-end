package com.puc.bancodedados.receitas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "receita", uniqueConstraints = {
        @UniqueConstraint(name = "uk_receita_nome_cozinheiro", columnNames = {"nome_receita", "cozinheiro_rg"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"cozinheiro", "categoria", "receitaIngredientes", "testes", "receitaLivros"})
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receita_id")
    private Long id;

    @NotBlank
    @Column(name = "nome_receita", nullable = false, length = 80)
    private String nomeReceita;

    @NotBlank
    @Lob
    @Column(name = "descricao_modo_preparo", nullable = false, columnDefinition = "TEXT")
    private String descricaoModoPreparo;

    @NotNull
    @PastOrPresent
    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    @NotNull
    @Min(value = 1, message = "Número de porções deve ser no mínimo 1")
    @Column(name = "numero_porcoes", nullable = false)
    private Integer numeroPorcoes;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cozinheiro_rg", nullable = false)
    private Cozinheiro cozinheiro;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ReceitaIngrediente> receitaIngredientes = new HashSet<>();

    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Teste> testes = new HashSet<>();

    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ReceitaLivro> receitaLivros = new HashSet<>();

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Receita receita = (Receita) o;
        return getId() != null && Objects.equals(getId(), receita.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
