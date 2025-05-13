package com.puc.bancodedados.receitas.repository;

import com.puc.bancodedados.receitas.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    Optional<Ingrediente> findByNomeIngrediente(String nomeIngrediente);
}
