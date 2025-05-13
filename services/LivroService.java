package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.LivroRequestDTO;
import com.puc.bancodedados.receitas.dtos.LivroResponseDTO;
import com.puc.bancodedados.receitas.dtos.ReceitaInfoDTO;
import com.puc.bancodedados.receitas.model.Editor;
import com.puc.bancodedados.receitas.model.Livro;
import com.puc.bancodedados.receitas.model.Receita;
import com.puc.bancodedados.receitas.model.ReceitaLivro;
import com.puc.bancodedados.receitas.model.ids.ReceitaLivroId;
import com.puc.bancodedados.receitas.repository.EditorRepository;
import com.puc.bancodedados.receitas.repository.LivroRepository;
import com.puc.bancodedados.receitas.repository.ReceitaLivroRepository;
import com.puc.bancodedados.receitas.repository.ReceitaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final EditorRepository editorRepository;

    @Autowired
    public LivroService(LivroRepository livroRepository, EditorRepository editorRepository) {
        this.livroRepository = livroRepository;
        this.editorRepository = editorRepository;
    }

    @Autowired
    private ReceitaRepository receitaRepository; // Adicionar injeção
    @Autowired
    private ReceitaLivroRepository receitaLivroRepository; // Adicionar injeção

    @Transactional
    public LivroResponseDTO criarLivro(LivroRequestDTO requestDTO) {
        if (livroRepository.existsById(requestDTO.isbn())) {
            throw new IllegalArgumentException("Livro com ISBN '" + requestDTO.isbn() + "' já existe.");
        }
        livroRepository.findByTitulo(requestDTO.titulo()).ifPresent(l -> {
            throw new IllegalArgumentException("Livro com título '" + requestDTO.titulo() + "' já existe.");
        });

        Editor editor = editorRepository.findById(requestDTO.editorRg())
                .orElseThrow(() -> new EntityNotFoundException("Editor com RG '" + requestDTO.editorRg() + "' não encontrado."));

        Livro livro = new Livro();
        livro.setIsbn(requestDTO.isbn());
        livro.setTitulo(requestDTO.titulo());
        livro.setEditor(editor);

        Livro livroSalvo = livroRepository.save(livro);
        return mapToResponseDTO(livroSalvo);
    }

    @Transactional(readOnly = true)
    public List<LivroResponseDTO> listarLivros() {
        return livroRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LivroResponseDTO buscarLivroPorIsbn(String isbn) {
        Livro livro = livroRepository.findById(isbn)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado com ISBN: " + isbn));
        return mapToResponseDTO(livro);
    }

    @Transactional
    public LivroResponseDTO atualizarLivro(String isbn, LivroRequestDTO requestDTO) {
        Livro livroExistente = livroRepository.findById(isbn)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado com ISBN: " + isbn));

        if (!isbn.equals(requestDTO.isbn())) {
            throw new IllegalArgumentException("O ISBN no corpo da requisição (" + requestDTO.isbn() +
                    ") não corresponde ao ISBN na URL (" + isbn + ").");
        }

        // Verifica unicidade do título para outros livros
        livroRepository.findByTitulo(requestDTO.titulo()).ifPresent(l -> {
            if (!l.getIsbn().equals(isbn)) {
                throw new IllegalArgumentException("Outro livro com título '" + requestDTO.titulo() + "' já existe.");
            }
        });

        Editor editor = editorRepository.findById(requestDTO.editorRg())
                .orElseThrow(() -> new EntityNotFoundException("Editor com RG '" + requestDTO.editorRg() + "' não encontrado."));

        livroExistente.setTitulo(requestDTO.titulo());
        livroExistente.setEditor(editor);
        // ISBN (PK) não é atualizado.

        Livro livroAtualizado = livroRepository.save(livroExistente);
        return mapToResponseDTO(livroAtualizado);
    }

    @Transactional
    public void deletarLivro(String isbn) {
        Livro livro = livroRepository.findById(isbn)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado com ISBN: " + isbn));
        if (livro.getReceitaLivros() != null && !livro.getReceitaLivros().isEmpty()){
            throw new IllegalStateException("Livro não pode ser deletado pois possui receitas associadas.");
        }
        livroRepository.deleteById(isbn);
    }

    @Transactional
    public LivroResponseDTO adicionarReceitaAoLivro(String isbn, Long receitaId) {
        Livro livro = livroRepository.findById(isbn)
                .orElseThrow(() -> new EntityNotFoundException("Livro com ISBN '" + isbn + "' não encontrado."));
        Receita receita = receitaRepository.findById(receitaId)
                .orElseThrow(() -> new EntityNotFoundException("Receita com ID '" + receitaId + "' não encontrada."));

        ReceitaLivroId receitaLivroId = new ReceitaLivroId(isbn, receitaId);
        if (receitaLivroRepository.existsById(receitaLivroId)) {
            throw new IllegalArgumentException("Receita já está associada a este livro.");
        }

        ReceitaLivro associacao = new ReceitaLivro();
        associacao.setId(receitaLivroId);
        associacao.setLivro(livro);
        associacao.setReceita(receita);
        receitaLivroRepository.save(associacao);

        // Recarrega o livro para refletir a nova associação no response
        Livro livroAtualizado = livroRepository.findById(isbn).get();
        return mapToResponseDTO(livroAtualizado); // mapToResponseDTO precisaria ser adaptado para incluir receitas do livro
    }

    @Transactional
    public LivroResponseDTO removerReceitaDoLivro(String isbn, Long receitaId) {
        Livro livro = livroRepository.findById(isbn)
                .orElseThrow(() -> new EntityNotFoundException("Livro com ISBN '" + isbn + "' não encontrado."));
        // Não precisa buscar a receita se apenas o ID for suficiente para a chave composta.
        ReceitaLivroId receitaLivroId = new ReceitaLivroId(isbn, receitaId);
        if (!receitaLivroRepository.existsById(receitaLivroId)) {
            throw new EntityNotFoundException("Associação entre livro ISBN '" + isbn + "' e receita ID '" + receitaId + "' não encontrada.");
        }

        receitaLivroRepository.deleteById(receitaLivroId);

        Livro livroAtualizado = livroRepository.findById(isbn).get();
        return mapToResponseDTO(livroAtualizado);
    }

    private LivroResponseDTO mapToResponseDTO(Livro livro) {
        Set<ReceitaInfoDTO> receitasInfo = livro.getReceitaLivros().stream()
                .map(rl -> new ReceitaInfoDTO(rl.getReceita().getId(), rl.getReceita().getNomeReceita()))
                .collect(Collectors.toSet());

        return new LivroResponseDTO(
                livro.getIsbn(),
                livro.getTitulo(),
                livro.getEditor().getEditorRg(),
                livro.getEditor().getEmpregado() != null ? livro.getEditor().getEmpregado().getNomeEmpregado() : "Editor não vinculado",
                receitasInfo
        );
    }

}
