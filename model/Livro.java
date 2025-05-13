package com.puc.bancodedados.receitas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "livro", uniqueConstraints = {
        @UniqueConstraint(name = "uk_livro_titulo", columnNames = "titulo")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "isbn")
@ToString(exclude = {"editor", "receitaLivros"})
public class Livro {

    @Id
    @NotBlank
    @Size(max = 20)
    @Column(name = "isbn", length = 20)
    private String isbn;

    @NotBlank
    @Column(name = "titulo", nullable = false, length = 100) // unique = true é tratado pelo @UniqueConstraint
    private String titulo;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "editor_rg", nullable = false)
    private Editor editor;

    @OneToMany(mappedBy = "livro", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ReceitaLivro> receitaLivros = new HashSet<>();
}
