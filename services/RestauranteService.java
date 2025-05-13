package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.RestauranteRequestDTO;
import com.puc.bancodedados.receitas.dtos.RestauranteResponseDTO;
import com.puc.bancodedados.receitas.model.Cozinheiro;
import com.puc.bancodedados.receitas.model.Restaurante;
import com.puc.bancodedados.receitas.repository.CozinheiroRepository;
import com.puc.bancodedados.receitas.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestauranteService {

    private final RestauranteRepository restauranteRepository;
    private final CozinheiroRepository cozinheiroRepository;

    @Autowired
    public RestauranteService(RestauranteRepository restauranteRepository, CozinheiroRepository cozinheiroRepository) {
        this.restauranteRepository = restauranteRepository;
        this.cozinheiroRepository = cozinheiroRepository;
    }

    @Transactional
    public RestauranteResponseDTO criarRestaurante(RestauranteRequestDTO requestDTO) {
        Cozinheiro cozinheiro = cozinheiroRepository.findById(requestDTO.cozinheiroRg())
                .orElseThrow(() -> new EntityNotFoundException("Cozinheiro com RG '" + requestDTO.cozinheiroRg() + "' não encontrado."));

        Restaurante restaurante = new Restaurante();
        restaurante.setNomeRestaurante(requestDTO.nomeRestaurante());
        restaurante.setCozinheiro(cozinheiro);

        Restaurante restauranteSalvo = restauranteRepository.save(restaurante);
        return mapToResponseDTO(restauranteSalvo);
    }

    @Transactional(readOnly = true)
    public List<RestauranteResponseDTO> listarRestaurantes() {
        return restauranteRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RestauranteResponseDTO> listarRestaurantesPorCozinheiro(Long cozinheiroRg) {
        if (!cozinheiroRepository.existsById(cozinheiroRg)) {
            throw new EntityNotFoundException("Cozinheiro com RG '" + cozinheiroRg + "' não encontrado.");
        }
        return restauranteRepository.findByCozinheiroCozinheiroRg(cozinheiroRg).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public RestauranteResponseDTO buscarRestaurantePorId(Long id) {
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado com ID: " + id));
        return mapToResponseDTO(restaurante);
    }

    @Transactional
    public RestauranteResponseDTO atualizarRestaurante(Long id, RestauranteRequestDTO requestDTO) {
        Restaurante restauranteExistente = restauranteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado com ID: " + id));

        Cozinheiro cozinheiro = cozinheiroRepository.findById(requestDTO.cozinheiroRg())
                .orElseThrow(() -> new EntityNotFoundException("Cozinheiro com RG '" + requestDTO.cozinheiroRg() + "' não encontrado."));

        restauranteExistente.setNomeRestaurante(requestDTO.nomeRestaurante());
        restauranteExistente.setCozinheiro(cozinheiro);

        Restaurante restauranteAtualizado = restauranteRepository.save(restauranteExistente);
        return mapToResponseDTO(restauranteAtualizado);
    }

    @Transactional
    public void deletarRestaurante(Long id) {
        if (!restauranteRepository.existsById(id)) {
            throw new EntityNotFoundException("Restaurante não encontrado com ID: " + id);
        }
        restauranteRepository.deleteById(id);
    }

    private RestauranteResponseDTO mapToResponseDTO(Restaurante restaurante) {
        String nomeCozinheiro = "N/A";
        if (restaurante.getCozinheiro() != null && restaurante.getCozinheiro().getEmpregado() != null) {
            nomeCozinheiro = restaurante.getCozinheiro().getEmpregado().getNomeEmpregado();
        } else if (restaurante.getCozinheiro() != null && restaurante.getCozinheiro().getNomeFantasia() != null) {
            nomeCozinheiro = restaurante.getCozinheiro().getNomeFantasia();
        }


        return new RestauranteResponseDTO(
                restaurante.getId(),
                restaurante.getNomeRestaurante(),
                restaurante.getCozinheiro() != null ? restaurante.getCozinheiro().getCozinheiroRg() : null,
                nomeCozinheiro
        );
    }
}
