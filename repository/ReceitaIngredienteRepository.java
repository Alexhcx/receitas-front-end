package com.puc.bancodedados.receitas.repository;


import com.puc.bancodedados.receitas.model.ReceitaIngrediente;
import com.puc.bancodedados.receitas.model.ids.ReceitaIngredienteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceitaIngredienteRepository extends JpaRepository<ReceitaIngrediente, ReceitaIngredienteId> {
    List<ReceitaIngrediente> findByIdReceitaId(Long receitaId);
    List<ReceitaIngrediente> findByIdIngredienteId(Long ingredienteId);
}
