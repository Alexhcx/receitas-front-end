package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.IngredienteRequestDTO;
import com.puc.bancodedados.receitas.dtos.IngredienteResponseDTO;
import com.puc.bancodedados.receitas.model.Ingrediente;
import com.puc.bancodedados.receitas.repository.IngredienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredienteService {

    private final IngredienteRepository ingredienteRepository;

    @Autowired
    public IngredienteService(IngredienteRepository ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    @Transactional
    public IngredienteResponseDTO criarIngrediente(IngredienteRequestDTO requestDTO) {
        ingredienteRepository.findByNomeIngrediente(requestDTO.nomeIngrediente())
                .ifPresent(i -> {
                    throw new IllegalArgumentException("Ingrediente com nome '" + requestDTO.nomeIngrediente() + "' já existe.");
                });

        Ingrediente ingrediente = new Ingrediente();
        ingrediente.setNomeIngrediente(requestDTO.nomeIngrediente());
        ingrediente.setDescricaoIngrediente(requestDTO.descricaoIngrediente());
        Ingrediente ingredienteSalvo = ingredienteRepository.save(ingrediente);
        return mapToResponseDTO(ingredienteSalvo);
    }

    @Transactional(readOnly = true)
    public List<IngredienteResponseDTO> listarIngredientes() {
        return ingredienteRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IngredienteResponseDTO buscarIngredientePorId(Long id) {
        Ingrediente ingrediente = ingredienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ingrediente não encontrado com ID: " + id));
        return mapToResponseDTO(ingrediente);
    }

    @Transactional
    public IngredienteResponseDTO atualizarIngrediente(Long id, IngredienteRequestDTO requestDTO) {
        Ingrediente ingredienteExistente = ingredienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ingrediente não encontrado com ID: " + id));

        ingredienteRepository.findByNomeIngrediente(requestDTO.nomeIngrediente())
                .ifPresent(i -> {
                    if (!i.getId().equals(id)) {
                        throw new IllegalArgumentException("Outro ingrediente com nome '" + requestDTO.nomeIngrediente() + "' já existe.");
                    }
                });

        ingredienteExistente.setNomeIngrediente(requestDTO.nomeIngrediente());
        ingredienteExistente.setDescricaoIngrediente(requestDTO.descricaoIngrediente());
        Ingrediente ingredienteAtualizado = ingredienteRepository.save(ingredienteExistente);
        return mapToResponseDTO(ingredienteAtualizado);
    }

    @Transactional
    public void deletarIngrediente(Long id) {
        Ingrediente ingrediente = ingredienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ingrediente não encontrado com ID: " + id));
        // Verificar se o ingrediente está em uso em ReceitaIngrediente
        if (ingrediente.getReceitaIngredientes() != null && !ingrediente.getReceitaIngredientes().isEmpty()){
            throw new IllegalStateException("Ingrediente não pode ser deletado pois está associado a receitas.");
        }
        ingredienteRepository.deleteById(id);
    }

    private IngredienteResponseDTO mapToResponseDTO(Ingrediente ingrediente) {
        return new IngredienteResponseDTO(
                ingrediente.getId(),
                ingrediente.getNomeIngrediente(),
                ingrediente.getDescricaoIngrediente()
        );
    }
}
