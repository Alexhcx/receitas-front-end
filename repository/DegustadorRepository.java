package com.puc.bancodedados.receitas.repository;

import com.puc.bancodedados.receitas.model.Degustador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DegustadorRepository extends JpaRepository<Degustador, Long> {
}
