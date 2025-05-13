package com.puc.bancodedados.receitas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "cozinheiro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"empregado", "restaurantes", "receitas"})
public class Cozinheiro {

    @Id
    @Column(name = "cozinheiro_rg")
    private Long cozinheiroRg;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "cozinheiro_rg")
    private Empregado empregado;

    @Column(name = "nome_fantasia", length = 80)
    private String nomeFantasia;

    @NotNull
    @Min(value = 1, message = "Meta mensal de receitas deve ser no mínimo 1")
    @Column(name = "meta_mensal_receitas", nullable = false)
    private Integer metaMensalReceitas;

    @NotNull
    @Min(value = 0, message = "Prazo inicial não pode ser negativo")
    @Max(value = 45, message = "Prazo inicial não pode exceder 45 dias")
    @Column(name = "prazo_inicial_dias", nullable = false)
    private Integer prazoInicialDias;

    @OneToMany(mappedBy = "cozinheiro", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Restaurante> restaurantes = new HashSet<>();

    @OneToMany(mappedBy = "cozinheiro", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Receita> receitas = new HashSet<>();

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Cozinheiro that = (Cozinheiro) o;
        return getCozinheiroRg() != null && Objects.equals(getCozinheiroRg(), that.getCozinheiroRg());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
