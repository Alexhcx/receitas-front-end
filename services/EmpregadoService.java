package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.EmpregadoRequestDTO;
import com.puc.bancodedados.receitas.dtos.EmpregadoResponseDTO;
import com.puc.bancodedados.receitas.model.Empregado;
import com.puc.bancodedados.receitas.repository.EmpregadoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpregadoService {

    private final EmpregadoRepository empregadoRepository;

    @Autowired
    public EmpregadoService(EmpregadoRepository empregadoRepository) {
        this.empregadoRepository = empregadoRepository;
    }

    @Transactional
    public EmpregadoResponseDTO criarEmpregado(EmpregadoRequestDTO requestDTO) {
        if (empregadoRepository.existsById(requestDTO.empregadoRg())) {
            throw new IllegalArgumentException("Empregado com RG '" + requestDTO.empregadoRg() + "' já existe.");
        }
        Empregado empregado = mapToEntity(requestDTO);
        Empregado empregadoSalvo = empregadoRepository.save(empregado);
        return mapToResponseDTO(empregadoSalvo);
    }

    @Transactional(readOnly = true)
    public List<EmpregadoResponseDTO> listarEmpregados() {
        return empregadoRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmpregadoResponseDTO buscarEmpregadoPorRg(Long rg) {
        Empregado empregado = empregadoRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Empregado não encontrado com RG: " + rg));
        return mapToResponseDTO(empregado);
    }

    @Transactional
    public EmpregadoResponseDTO atualizarEmpregado(Long rg, EmpregadoRequestDTO requestDTO) {
        Empregado empregadoExistente = empregadoRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Empregado não encontrado com RG: " + rg));

        // RG não é atualizável, mas outros campos sim.
        // Se o RG no DTO for diferente do path variable, lançar erro ou ignorar.
        if (!rg.equals(requestDTO.empregadoRg())) {
            throw new IllegalArgumentException("O RG do empregado no corpo da requisição (" + requestDTO.empregadoRg() +
                    ") não corresponde ao RG na URL (" + rg + ").");
        }

        empregadoExistente.setNomeEmpregado(requestDTO.nomeEmpregado());
        empregadoExistente.setDataAdmissao(requestDTO.dataAdmissao());
        empregadoExistente.setSalario(requestDTO.salario());

        Empregado empregadoAtualizado = empregadoRepository.save(empregadoExistente);
        return mapToResponseDTO(empregadoAtualizado);
    }

    @Transactional
    public void deletarEmpregado(Long rg) {
        if (!empregadoRepository.existsById(rg)) {
            throw new EntityNotFoundException("Empregado não encontrado com RG: " + rg);
        }
        // Adicionar verificações de dependência (Cozinheiro, Editor, Degustador) antes de deletar
        // Ex: if (cozinheiroRepository.existsById(rg)) throw new IllegalStateException("...");
        empregadoRepository.deleteById(rg);
    }

    private Empregado mapToEntity(EmpregadoRequestDTO dto) {
        Empregado empregado = new Empregado();
        empregado.setEmpregadoRg(dto.empregadoRg());
        empregado.setNomeEmpregado(dto.nomeEmpregado());
        empregado.setDataAdmissao(dto.dataAdmissao());
        empregado.setSalario(dto.salario());
        return empregado;
    }

    private EmpregadoResponseDTO mapToResponseDTO(Empregado empregado) {
        return new EmpregadoResponseDTO(
                empregado.getEmpregadoRg(),
                empregado.getNomeEmpregado(),
                empregado.getDataAdmissao(),
                empregado.getSalario()
        );
    }
}
