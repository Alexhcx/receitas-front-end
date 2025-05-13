package com.puc.bancodedados.receitas.controller;

import com.puc.bancodedados.receitas.dtos.LivroRequestDTO;
import com.puc.bancodedados.receitas.dtos.LivroResponseDTO;
import com.puc.bancodedados.receitas.dtos.AssociarReceitaLivroRequestDTO;
import com.puc.bancodedados.receitas.services.LivroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livros")
public class LivroController {

    private final LivroService livroService;

    @Autowired
    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @PostMapping
    public ResponseEntity<LivroResponseDTO> criarLivro(@Valid @RequestBody LivroRequestDTO requestDTO) {
        LivroResponseDTO novoLivro = livroService.criarLivro(requestDTO);
        return new ResponseEntity<>(novoLivro, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LivroResponseDTO>> listarLivros() {
        List<LivroResponseDTO> livros = livroService.listarLivros();
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/{isbn}")
    public ResponseEntity<LivroResponseDTO> buscarLivroPorIsbn(@PathVariable String isbn) {
        LivroResponseDTO livro = livroService.buscarLivroPorIsbn(isbn);
        return ResponseEntity.ok(livro);
    }

    @PutMapping("/{isbn}")
    public ResponseEntity<LivroResponseDTO> atualizarLivro(@PathVariable String isbn, @Valid @RequestBody LivroRequestDTO requestDTO) {
        LivroResponseDTO livroAtualizado = livroService.atualizarLivro(isbn, requestDTO);
        return ResponseEntity.ok(livroAtualizado);
    }

    @DeleteMapping("/{isbn}")
    public ResponseEntity<Void> deletarLivro(@PathVariable String isbn) {
        livroService.deletarLivro(isbn);
        return ResponseEntity.noContent().build();
    }

    // Endpoints para gerenciar associação ReceitaLivro
    @PostMapping("/{isbn}/receitas/{receitaId}")
    public ResponseEntity<LivroResponseDTO> adicionarReceitaAoLivro(@PathVariable String isbn, @PathVariable Long receitaId) {
        LivroResponseDTO livroAtualizado = livroService.adicionarReceitaAoLivro(isbn, receitaId);
        return ResponseEntity.ok(livroAtualizado);
    }

    @DeleteMapping("/{isbn}/receitas/{receitaId}")
    public ResponseEntity<LivroResponseDTO> removerReceitaDoLivro(@PathVariable String isbn, @PathVariable Long receitaId) {
        LivroResponseDTO livroAtualizado = livroService.removerReceitaDoLivro(isbn, receitaId);
        return ResponseEntity.ok(livroAtualizado);
    }
}
