package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.TesteRequestDTO;
import com.puc.bancodedados.receitas.dtos.TesteResponseDTO;
import com.puc.bancodedados.receitas.model.Degustador;
import com.puc.bancodedados.receitas.model.Receita;
import com.puc.bancodedados.receitas.model.Teste;
import com.puc.bancodedados.receitas.repository.DegustadorRepository;
import com.puc.bancodedados.receitas.repository.ReceitaRepository;
import com.puc.bancodedados.receitas.repository.TesteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TesteService {

    private final TesteRepository testeRepository;
    private final DegustadorRepository degustadorRepository;
    private final ReceitaRepository receitaRepository;

    @Autowired
    public TesteService(TesteRepository testeRepository, DegustadorRepository degustadorRepository, ReceitaRepository receitaRepository) {
        this.testeRepository = testeRepository;
        this.degustadorRepository = degustadorRepository;
        this.receitaRepository = receitaRepository;
    }

    @Transactional
    public TesteResponseDTO criarTeste(TesteRequestDTO requestDTO) {
        Degustador degustador = degustadorRepository.findById(requestDTO.degustadorRg())
                .orElseThrow(() -> new EntityNotFoundException("Degustador com RG '" + requestDTO.degustadorRg() + "' não encontrado."));
        Receita receita = receitaRepository.findById(requestDTO.receitaId())
                .orElseThrow(() -> new EntityNotFoundException("Receita com ID '" + requestDTO.receitaId() + "' não encontrada."));

        // Regra: "todo degustador contratado pela firma já executou pelo menos um teste."
        // Esta regra é mais sobre a consistência dos dados iniciais ou uma restrição que
        // o sistema deve garantir ao longo do tempo, não necessariamente algo que impede
        // a criação de um novo teste individual se o degustador já existe.
        // Se a regra fosse "um degustador só pode testar se já tiver feito outros testes", seria diferente.

        Teste teste = new Teste();
        teste.setDataTeste(requestDTO.dataTeste());
        teste.setNota(requestDTO.nota());
        teste.setDegustador(degustador);
        teste.setReceita(receita);

        Teste testeSalvo = testeRepository.save(teste);
        return mapToResponseDTO(testeSalvo);
    }

    @Transactional(readOnly = true)
    public List<TesteResponseDTO> listarTestes() {
        return testeRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TesteResponseDTO buscarTestePorId(Long id) {
        Teste teste = testeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teste não encontrado com ID: " + id));
        return mapToResponseDTO(teste);
    }

    @Transactional
    public TesteResponseDTO atualizarTeste(Long id, TesteRequestDTO requestDTO) {
        Teste testeExistente = testeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teste não encontrado com ID: " + id));

        Degustador degustador = degustadorRepository.findById(requestDTO.degustadorRg())
                .orElseThrow(() -> new EntityNotFoundException("Degustador com RG '" + requestDTO.degustadorRg() + "' não encontrado."));
        Receita receita = receitaRepository.findById(requestDTO.receitaId())
                .orElseThrow(() -> new EntityNotFoundException("Receita com ID '" + requestDTO.receitaId() + "' não encontrada."));

        testeExistente.setDataTeste(requestDTO.dataTeste());
        testeExistente.setNota(requestDTO.nota());
        testeExistente.setDegustador(degustador);
        testeExistente.setReceita(receita);

        Teste testeAtualizado = testeRepository.save(testeExistente);
        return mapToResponseDTO(testeAtualizado);
    }

    @Transactional
    public void deletarTeste(Long id) {
        if (!testeRepository.existsById(id)) {
            throw new EntityNotFoundException("Teste não encontrado com ID: " + id);
        }
        testeRepository.deleteById(id);
    }

    private TesteResponseDTO mapToResponseDTO(Teste teste) {
        String nomeDegustador = "N/A";
        if (teste.getDegustador() != null && teste.getDegustador().getEmpregado() != null) {
            nomeDegustador = teste.getDegustador().getEmpregado().getNomeEmpregado();
        }

        String nomeReceita = "N/A";
        if (teste.getReceita() != null) {
            nomeReceita = teste.getReceita().getNomeReceita();
        }

        return new TesteResponseDTO(
                teste.getId(),
                teste.getDataTeste(),
                teste.getNota(),
                teste.getDegustador() != null ? teste.getDegustador().getDegustadorRg() : null,
                nomeDegustador,
                teste.getReceita() != null ? teste.getReceita().getId() : null,
                nomeReceita
        );
    }
}
