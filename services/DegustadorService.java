package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.DegustadorRequestDTO;
import com.puc.bancodedados.receitas.dtos.DegustadorResponseDTO;
import com.puc.bancodedados.receitas.model.Degustador;
import com.puc.bancodedados.receitas.model.Empregado;
import com.puc.bancodedados.receitas.repository.DegustadorRepository;
import com.puc.bancodedados.receitas.repository.EmpregadoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DegustadorService {

    private final DegustadorRepository degustadorRepository;
    private final EmpregadoRepository empregadoRepository;

    @Autowired
    public DegustadorService(DegustadorRepository degustadorRepository, EmpregadoRepository empregadoRepository) {
        this.degustadorRepository = degustadorRepository;
        this.empregadoRepository = empregadoRepository;
    }

    @Transactional
    public DegustadorResponseDTO criarDegustador(DegustadorRequestDTO requestDTO) {
        Empregado empregado = empregadoRepository.findById(requestDTO.degustadorRg())
                .orElseThrow(() -> new EntityNotFoundException("Empregado com RG '" + requestDTO.degustadorRg() + "' não encontrado para associar ao degustador."));

        if (degustadorRepository.existsById(requestDTO.degustadorRg())) {
            throw new IllegalArgumentException("Degustador com RG '" + requestDTO.degustadorRg() + "' já existe.");
        }

        Degustador degustador = new Degustador();
        degustador.setDegustadorRg(requestDTO.degustadorRg());
        degustador.setEmpregado(empregado);
        degustador.setDtContrato(requestDTO.dtContrato());

        Degustador degustadorSalvo = degustadorRepository.save(degustador);
        return mapToResponseDTO(degustadorSalvo);
    }

    @Transactional(readOnly = true)
    public List<DegustadorResponseDTO> listarDegustadores() {
        return degustadorRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DegustadorResponseDTO buscarDegustadorPorRg(Long rg) {
        Degustador degustador = degustadorRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Degustador não encontrado com RG: " + rg));
        return mapToResponseDTO(degustador);
    }

    @Transactional
    public DegustadorResponseDTO atualizarDegustador(Long rg, DegustadorRequestDTO requestDTO) {
        Degustador degustadorExistente = degustadorRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Degustador não encontrado com RG: " + rg));

        if (!rg.equals(requestDTO.degustadorRg())) {
            throw new IllegalArgumentException("O RG do degustador no corpo da requisição (" + requestDTO.degustadorRg() +
                    ") não corresponde ao RG na URL (" + rg + ").");
        }
        
        // Atualiza apenas a data de contrato
        degustadorExistente.setDtContrato(requestDTO.dtContrato());

        Degustador degustadorAtualizado = degustadorRepository.save(degustadorExistente);
        return mapToResponseDTO(degustadorAtualizado);
    }

    @Transactional
    public void deletarDegustador(Long rg) {
        Degustador degustador = degustadorRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Degustador não encontrado com RG: " + rg));
        // Verificar se há testes associados
        if (degustador.getTestes() != null && !degustador.getTestes().isEmpty()) {
            throw new IllegalStateException("Degustador não pode ser deletado pois possui testes associados.");
        }
        degustadorRepository.deleteById(rg);
    }

    private DegustadorResponseDTO mapToResponseDTO(Degustador degustador) {
        return new DegustadorResponseDTO(
                degustador.getDegustadorRg(),
                degustador.getEmpregado() != null ? degustador.getEmpregado().getNomeEmpregado() : null,
                degustador.getDtContrato()
        );
    }
}
