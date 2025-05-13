package com.puc.bancodedados.receitas.services;

import com.puc.bancodedados.receitas.dtos.ReceitaIngredienteItemDTO;
import com.puc.bancodedados.receitas.dtos.ReceitaRequestDTO;
import com.puc.bancodedados.receitas.dtos.ReceitaResponseDTO;
import com.puc.bancodedados.receitas.model.*;
import com.puc.bancodedados.receitas.model.ids.ReceitaIngredienteId;
import com.puc.bancodedados.receitas.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final CozinheiroRepository cozinheiroRepository;
    private final CategoriaRepository categoriaRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ReceitaIngredienteRepository receitaIngredienteRepository; // Para gerenciar a associação

    @Autowired
    public ReceitaService(ReceitaRepository receitaRepository,
                          CozinheiroRepository cozinheiroRepository,
                          CategoriaRepository categoriaRepository,
                          IngredienteRepository ingredienteRepository,
                          ReceitaIngredienteRepository receitaIngredienteRepository) {
        this.receitaRepository = receitaRepository;
        this.cozinheiroRepository = cozinheiroRepository;
        this.categoriaRepository = categoriaRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.receitaIngredienteRepository = receitaIngredienteRepository;
    }

    @Transactional
    public ReceitaResponseDTO criarReceita(ReceitaRequestDTO requestDTO) {
        Cozinheiro cozinheiro = cozinheiroRepository.findById(requestDTO.cozinheiroRg())
                .orElseThrow(() -> new EntityNotFoundException("Cozinheiro com RG '" + requestDTO.cozinheiroRg() + "' não encontrado."));
        Categoria categoria = categoriaRepository.findById(requestDTO.categoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria com ID '" + requestDTO.categoriaId() + "' não encontrada."));

        // Validar unicidade: "um mesmo 'chef' não elabora duas receitas com o mesmo nome"
        receitaRepository.findByNomeReceitaAndCozinheiroCozinheiroRg(requestDTO.nomeReceita(), requestDTO.cozinheiroRg())
                .ifPresent(r -> {
                    throw new IllegalArgumentException("Cozinheiro já possui uma receita com o nome '" + requestDTO.nomeReceita() + "'.");
                });

        Receita receita = new Receita();
        receita.setNomeReceita(requestDTO.nomeReceita());
        receita.setDescricaoModoPreparo(requestDTO.descricaoModoPreparo());
        receita.setDataCriacao(requestDTO.dataCriacao());
        receita.setNumeroPorcoes(requestDTO.numeroPorcoes());
        receita.setCozinheiro(cozinheiro);
        receita.setCategoria(categoria);
        // Salva a receita primeiro para obter o ID
        Receita receitaSalva = receitaRepository.save(receita);

        // Processar ingredientes
        Set<ReceitaIngrediente> ingredientesAssociados = new HashSet<>();
        if (requestDTO.ingredientes() != null) {
            for (ReceitaIngredienteItemDTO itemDTO : requestDTO.ingredientes()) {
                Ingrediente ingrediente = ingredienteRepository.findById(itemDTO.ingredienteId())
                        .orElseThrow(() -> new EntityNotFoundException("Ingrediente com ID '" + itemDTO.ingredienteId() + "' não encontrado."));

                ReceitaIngrediente ri = new ReceitaIngrediente();
                ri.setId(new ReceitaIngredienteId(receitaSalva.getId(), ingrediente.getId()));
                ri.setReceita(receitaSalva);
                ri.setIngrediente(ingrediente);
                ri.setQuantidade(itemDTO.quantidade());
                ri.setMedida(itemDTO.medida());
                ingredientesAssociados.add(receitaIngredienteRepository.save(ri));
            }
        }
        receitaSalva.setReceitaIngredientes(ingredientesAssociados); // Atualiza a entidade com as associações salvas

        return mapToResponseDTO(receitaSalva);
    }

    @Transactional(readOnly = true)
    public List<ReceitaResponseDTO> listarReceitas() {
        return receitaRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReceitaResponseDTO buscarReceitaPorId(Long id) {
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receita não encontrada com ID: " + id));
        return mapToResponseDTO(receita);
    }

    @Transactional
    public ReceitaResponseDTO atualizarReceita(Long id, ReceitaRequestDTO requestDTO) {
        Receita receitaExistente = receitaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receita não encontrada com ID: " + id));

        Cozinheiro cozinheiro = cozinheiroRepository.findById(requestDTO.cozinheiroRg())
                .orElseThrow(() -> new EntityNotFoundException("Cozinheiro com RG '" + requestDTO.cozinheiroRg() + "' não encontrado."));
        Categoria categoria = categoriaRepository.findById(requestDTO.categoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria com ID '" + requestDTO.categoriaId() + "' não encontrada."));

        // Validar unicidade se o nome ou cozinheiro mudou
        if (!receitaExistente.getNomeReceita().equals(requestDTO.nomeReceita()) ||
                !receitaExistente.getCozinheiro().getCozinheiroRg().equals(requestDTO.cozinheiroRg())) {
            receitaRepository.findByNomeReceitaAndCozinheiroCozinheiroRg(requestDTO.nomeReceita(), requestDTO.cozinheiroRg())
                    .ifPresent(r -> {
                        if (!r.getId().equals(id)) { // Se for outra receita
                            throw new IllegalArgumentException("Cozinheiro já possui outra receita com o nome '" + requestDTO.nomeReceita() + "'.");
                        }
                    });
        }

        receitaExistente.setNomeReceita(requestDTO.nomeReceita());
        receitaExistente.setDescricaoModoPreparo(requestDTO.descricaoModoPreparo());
        receitaExistente.setDataCriacao(requestDTO.dataCriacao());
        receitaExistente.setNumeroPorcoes(requestDTO.numeroPorcoes());
        receitaExistente.setCozinheiro(cozinheiro);
        receitaExistente.setCategoria(categoria);

        // Atualizar ingredientes: remover os antigos e adicionar os novos
        // (uma abordagem simples; pode ser otimizada para apenas adicionar/remover/atualizar diferenças)
        receitaIngredienteRepository.deleteAll(receitaExistente.getReceitaIngredientes());
        receitaExistente.getReceitaIngredientes().clear(); // Limpa a coleção na entidade

        Set<ReceitaIngrediente> ingredientesAtualizados = new HashSet<>();
        if (requestDTO.ingredientes() != null) {
            for (ReceitaIngredienteItemDTO itemDTO : requestDTO.ingredientes()) {
                Ingrediente ingrediente = ingredienteRepository.findById(itemDTO.ingredienteId())
                        .orElseThrow(() -> new EntityNotFoundException("Ingrediente com ID '" + itemDTO.ingredienteId() + "' não encontrado."));

                ReceitaIngrediente ri = new ReceitaIngrediente();
                ri.setId(new ReceitaIngredienteId(id, ingrediente.getId())); // Usa o ID da receita existente
                ri.setReceita(receitaExistente);
                ri.setIngrediente(ingrediente);
                ri.setQuantidade(itemDTO.quantidade());
                ri.setMedida(itemDTO.medida());
                ingredientesAtualizados.add(receitaIngredienteRepository.save(ri));
            }
        }
        receitaExistente.setReceitaIngredientes(ingredientesAtualizados);

        Receita receitaAtualizada = receitaRepository.save(receitaExistente); // Salva a receita principal com as novas associações
        return mapToResponseDTO(receitaAtualizada);
    }

    @Transactional
    public void deletarReceita(Long id) {
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receita não encontrada com ID: " + id));
        // A remoção de ReceitaIngrediente, Teste, ReceitaLivro é feita por CascadeType.ALL na entidade Receita.
        receitaRepository.delete(receita);
    }

    private ReceitaResponseDTO mapToResponseDTO(Receita receita) {
        Set<ReceitaIngredienteItemDTO> ingredientesDTO = receita.getReceitaIngredientes().stream()
                .map(ri -> new ReceitaIngredienteItemDTO(
                        ri.getIngrediente().getId(),
                        ri.getQuantidade(),
                        ri.getMedida()
                        // Poderia adicionar nome do ingrediente aqui se fosse necessário no response
                ))
                .collect(Collectors.toSet());

        String nomeCozinheiro = "N/A";
        if (receita.getCozinheiro() != null && receita.getCozinheiro().getEmpregado() != null) {
            nomeCozinheiro = receita.getCozinheiro().getEmpregado().getNomeEmpregado();
        } else if (receita.getCozinheiro() != null && receita.getCozinheiro().getNomeFantasia() != null) {
            nomeCozinheiro = receita.getCozinheiro().getNomeFantasia();
        }


        return new ReceitaResponseDTO(
                receita.getId(),
                receita.getNomeReceita(),
                receita.getDescricaoModoPreparo(),
                receita.getDataCriacao(),
                receita.getNumeroPorcoes(),
                receita.getCozinheiro() != null ? receita.getCozinheiro().getCozinheiroRg() : null,
                nomeCozinheiro,
                receita.getCategoria() != null ? receita.getCategoria().getId() : null,
                receita.getCategoria() != null ? receita.getCategoria().getNomeCategoria() : "N/A",
                ingredientesDTO
        );
    }
}
