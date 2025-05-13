package com.puc.bancodedados.receitas.repository;

import com.puc.bancodedados.receitas.model.Editor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EditorRepository extends JpaRepository<Editor, Long> {
}
