package com.puc.bancodedados.receitas.model;


import com.puc.bancodedados.receitas.model.ids.ReceitaLivroId;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "receita_livro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"livro", "receita"})
public class ReceitaLivro {

    @EmbeddedId
    private ReceitaLivroId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("isbn")
    @JoinColumn(name = "isbn", insertable = false, updatable = false)
    private Livro livro;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("receitaId")
    @JoinColumn(name = "receita_id", insertable = false, updatable = false)
    private Receita receita;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        ReceitaLivro that = (ReceitaLivro) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }
}
