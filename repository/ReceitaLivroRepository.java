package com.puc.bancodedados.receitas.repository;


import com.puc.bancodedados.receitas.model.ReceitaLivro;
import com.puc.bancodedados.receitas.model.ids.ReceitaLivroId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceitaLivroRepository extends JpaRepository<ReceitaLivro, ReceitaLivroId> {
    List<ReceitaLivro> findByIdIsbn(String isbn);
    List<ReceitaLivro> findByIdReceitaId(Long receitaId);
}
