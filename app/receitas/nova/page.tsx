"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { fetchData, postData } from "@/lib/api"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IngredienteSelect, type ReceitaIngrediente } from "@/components/ingrediente-select"

interface Categoria {
  id: number
  nomeCategoria: string
}

interface Cozinheiro {
  cozinheiroRg: number
  nomeEmpregado: string
  nomeFantasia: string | null
}

export default function NovaReceitaPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cozinheiros, setCozinheiros] = useState<Cozinheiro[]>([])
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(true)

  const [nomeReceita, setNomeReceita] = useState("")
  const [descricaoModoPreparo, setDescricaoModoPreparo] = useState("")
  const [dataCriacao, setDataCriacao] = useState("")
  const [numeroPorcoes, setNumeroPorcoes] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [cozinheiroRg, setCozinheiroRg] = useState("")
  const [ingredientes, setIngredientes] = useState<ReceitaIngrediente[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        setIsLoadingDependencies(true)
        const [categoriasData, cozinheirosData] = await Promise.all([
          fetchData<Categoria[]>("/categorias"),
          fetchData<Cozinheiro[]>("/cozinheiros"),
        ])
        setCategorias(categoriasData)
        setCozinheiros(cozinheirosData)

        // Define a data atual como padrão
        setDataCriacao(new Date().toISOString().split("T")[0])
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados necessários.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingDependencies(false)
      }
    }

    loadDependencies()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !nomeReceita.trim() ||
      !descricaoModoPreparo.trim() ||
      !dataCriacao ||
      !numeroPorcoes ||
      !categoriaId ||
      !cozinheiroRg
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios, exceto os ingredientes.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await postData("/receitas", {
        nomeReceita,
        descricaoModoPreparo,
        dataCriacao,
        numeroPorcoes: Number(numeroPorcoes),
        categoriaId: Number(categoriaId),
        cozinheiroRg: Number(cozinheiroRg),
        ingredientes: ingredientes.length > 0 ? ingredientes : null,
      })

      toast({
        title: "Receita criada",
        description: "A receita foi criada com sucesso.",
      })

      router.push("/receitas")
    } catch (error) {
      toast({
        title: "Erro ao criar receita",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar a receita.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Nova Receita</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Receita</CardTitle>
            <CardDescription>Crie uma nova receita culinária</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nomeReceita">Nome da Receita</Label>
              <Input
                id="nomeReceita"
                value={nomeReceita}
                onChange={(e) => setNomeReceita(e.target.value)}
                placeholder="Digite o nome da receita"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoriaId">Categoria</Label>
                {isLoadingDependencies ? (
                  <p>Carregando categorias...</p>
                ) : (
                  <Select onValueChange={setCategoriaId} value={categoriaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nomeCategoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cozinheiroRg">Cozinheiro</Label>
                {isLoadingDependencies ? (
                  <p>Carregando cozinheiros...</p>
                ) : (
                  <Select onValueChange={setCozinheiroRg} value={cozinheiroRg}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cozinheiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {cozinheiros.map((cozinheiro) => (
                        <SelectItem key={cozinheiro.cozinheiroRg} value={cozinheiro.cozinheiroRg.toString()}>
                          {cozinheiro.nomeEmpregado} {cozinheiro.nomeFantasia ? `(${cozinheiro.nomeFantasia})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataCriacao">Data de Criação</Label>
                <Input
                  id="dataCriacao"
                  type="date"
                  value={dataCriacao}
                  onChange={(e) => setDataCriacao(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroPorcoes">Número de Porções</Label>
                <Input
                  id="numeroPorcoes"
                  type="number"
                  min="1"
                  value={numeroPorcoes}
                  onChange={(e) => setNumeroPorcoes(e.target.value)}
                  placeholder="Digite o número de porções"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoModoPreparo">Modo de Preparo</Label>
              <Textarea
                id="descricaoModoPreparo"
                value={descricaoModoPreparo}
                onChange={(e) => setDescricaoModoPreparo(e.target.value)}
                placeholder="Descreva o modo de preparo da receita"
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ingredientes</Label>
              <IngredienteSelect value={ingredientes} onChange={setIngredientes} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/receitas">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
