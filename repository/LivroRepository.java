package com.puc.bancodedados.receitas.repository;


import com.puc.bancodedados.receitas.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivroRepository extends JpaRepository<Livro, String> {
    Optional<Livro> findByTitulo(String titulo);
    List<Livro> findByEditorEditorRg(Long editorRg);
}
