package com.puc.bancodedados.receitas.repository;

import com.puc.bancodedados.receitas.model.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {
    List<Restaurante> findByCozinheiroCozinheiroRg(Long cozinheiroRg);
}
