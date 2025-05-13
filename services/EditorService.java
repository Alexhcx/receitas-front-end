package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.EditorRequestDTO;
import com.puc.bancodedados.receitas.dtos.EditorResponseDTO;
import com.puc.bancodedados.receitas.model.Editor;
import com.puc.bancodedados.receitas.model.Empregado;
import com.puc.bancodedados.receitas.repository.EditorRepository;
import com.puc.bancodedados.receitas.repository.EmpregadoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EditorService {

    private final EditorRepository editorRepository;
    private final EmpregadoRepository empregadoRepository;

    @Autowired
    public EditorService(EditorRepository editorRepository, EmpregadoRepository empregadoRepository) {
        this.editorRepository = editorRepository;
        this.empregadoRepository = empregadoRepository;
    }

    @Transactional
    public EditorResponseDTO criarEditor(EditorRequestDTO requestDTO) {
        Empregado empregado = empregadoRepository.findById(requestDTO.editorRg())
                .orElseThrow(() -> new EntityNotFoundException("Empregado com RG '" + requestDTO.editorRg() + "' não encontrado para associar ao editor."));

        if (editorRepository.existsById(requestDTO.editorRg())) {
            throw new IllegalArgumentException("Editor com RG '" + requestDTO.editorRg() + "' já existe.");
        }

        Editor editor = new Editor();
        editor.setEditorRg(requestDTO.editorRg());
        editor.setEmpregado(empregado);
        editor.setDtContrato(requestDTO.dtContrato());

        Editor editorSalvo = editorRepository.save(editor);
        return mapToResponseDTO(editorSalvo);
    }

    @Transactional(readOnly = true)
    public List<EditorResponseDTO> listarEditores() {
        return editorRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EditorResponseDTO buscarEditorPorRg(Long rg) {
        Editor editor = editorRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Editor não encontrado com RG: " + rg));
        return mapToResponseDTO(editor);
    }

    @Transactional
    public EditorResponseDTO atualizarEditor(Long rg, EditorRequestDTO requestDTO) {
        Editor editorExistente = editorRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Editor não encontrado com RG: " + rg));

        if (!rg.equals(requestDTO.editorRg())) {
            throw new IllegalArgumentException("O RG do editor no corpo da requisição (" + requestDTO.editorRg() +
                    ") não corresponde ao RG na URL (" + rg + ").");
        }
        
        // Atualiza apenas a data de contrato
        editorExistente.setDtContrato(requestDTO.dtContrato());

        Editor editorAtualizado = editorRepository.save(editorExistente);
        return mapToResponseDTO(editorAtualizado);
    }

    @Transactional
    public void deletarEditor(Long rg) {
        Editor editor = editorRepository.findById(rg)
                .orElseThrow(() -> new EntityNotFoundException("Editor não encontrado com RG: " + rg));
        // Verificar se há livros associados
        if (editor.getLivros() != null && !editor.getLivros().isEmpty()) {
            throw new IllegalStateException("Editor não pode ser deletado pois possui livros associados.");
        }
        editorRepository.deleteById(rg);
    }

    private EditorResponseDTO mapToResponseDTO(Editor editor) {
        return new EditorResponseDTO(
                editor.getEditorRg(),
                editor.getEmpregado() != null ? editor.getEmpregado().getNomeEmpregado() : null,
                editor.getDtContrato()
        );
    }
}
