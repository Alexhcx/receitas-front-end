package com.puc.bancodedados.receitas.repository;


import com.puc.bancodedados.receitas.model.Teste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TesteRepository extends JpaRepository<Teste, Long> {
    List<Teste> findByReceitaId(Long receitaId);
    List<Teste> findByDegustadorDegustadorRg(Long degustadorRg);
}
