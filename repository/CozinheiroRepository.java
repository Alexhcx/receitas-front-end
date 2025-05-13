package com.puc.bancodedados.receitas.repository;


import com.puc.bancodedados.receitas.model.Cozinheiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CozinheiroRepository extends JpaRepository<Cozinheiro, Long> {
}
