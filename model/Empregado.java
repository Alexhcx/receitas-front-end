package com.puc.bancodedados.receitas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "empregado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Empregado {

    @Id
    @Column(name = "empregado_rg")
    private Long empregadoRg;

    @NotBlank
    @Column(name = "nome_empregado", nullable = false, length = 50)
    private String nomeEmpregado;

    @NotNull
    @PastOrPresent
    @Column(name = "data_admissao", nullable = false)
    private LocalDate dataAdmissao;

    @NotNull
    @DecimalMin(value = "0.01", message = "Salário deve ser maior que zero")
    @Column(name = "salario", nullable = false, precision = 8, scale = 2)
    private BigDecimal salario;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Empregado empregado = (Empregado) o;
        return getEmpregadoRg() != null && Objects.equals(getEmpregadoRg(), empregado.getEmpregadoRg());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
