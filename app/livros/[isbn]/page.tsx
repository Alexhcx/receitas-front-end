"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchData, deleteData, postData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { ArrowLeft, Pencil, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteConfirmation } from "@/components/delete-confirmation"

interface ReceitaInfo {
  id: number
  nomeReceita: string
}

interface Livro {
  isbn: string
  titulo: string
  editorRg: number
  nomeEditor: string
  receitas: ReceitaInfo[]
}

interface Receita {
  id: number
  nomeReceita: string
}

export default function DetalhesLivroPage({ params }: { params: { isbn: string } }) {
  const [livro, setLivro] = useState<Livro | null>(null)
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [receitaSelecionada, setReceitaSelecionada] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingReceitas, setIsLoadingReceitas] = useState(true)
  const [isAdicionando, setIsAdicionando] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isbn = params.isbn

  const loadLivro = async () => {
    try {
      setIsLoading(true)
      const data = await fetchData<Livro>(`/livros/${isbn}`)
      setLivro(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar livro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do livro.",
        variant: "destructive",
      })
      router.push("/livros")
    } finally {
      setIsLoading(false)
    }
  }

  const loadReceitas = async () => {
    try {
      setIsLoadingReceitas(true)
      const data = await fetchData<Receita[]>("/receitas")
      setReceitas(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar receitas",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar as receitas.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingReceitas(false)
    }
  }

  useEffect(() => {
    loadLivro()
    loadReceitas()
  }, [isbn, router, toast])

  const handleAdicionarReceita = async () => {
    if (!receitaSelecionada) {
      toast({
        title: "Selecione uma receita",
        description: "Você precisa selecionar uma receita para adicionar ao livro.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAdicionando(true)
      await postData(`/livros/${isbn}/receitas/${receitaSelecionada}`, {})
      await loadLivro()
      setReceitaSelecionada("")
      toast({
        title: "Receita adicionada",
        description: "A receita foi adicionada ao livro com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar receita",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar a receita ao livro.",
        variant: "destructive",
      })
    } finally {
      setIsAdicionando(false)
    }
  }

  const handleRemoverReceita = async (receitaId: number) => {
    try {
      await deleteData(`/livros/${isbn}/receitas/${receitaId}`)
      await loadLivro()
      toast({
        title: "Receita removida",
        description: "A receita foi removida do livro com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover receita",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao remover a receita do livro.",
        variant: "destructive",
      })
    }
  }

  // Filtra as receitas que ainda não estão no livro
  const receitasDisponiveis = receitas.filter((receita) => !livro?.receitas.some((r) => r.id === receita.id))

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Detalhes do Livro</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do livro...</p>
        </div>
      </div>
    )
  }

  if (!livro) {
    return (
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Detalhes do Livro</h1>
        <div className="flex justify-center items-center h-64">
          <p>Livro não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{livro.titulo}</h1>
        <div className="flex gap-2">
          <Link href="/livros">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </Link>
          <Link href={`/livros/${livro.isbn}/editar`}>
            <Button>
              <Pencil className="h-4 w-4 mr-2" /> Editar
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Livro</CardTitle>
          <CardDescription>Detalhes básicos do livro</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ISBN</p>
            <p>{livro.isbn}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Editor</p>
            <p>{livro.nomeEditor}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>Receitas incluídas neste livro</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={receitaSelecionada} onValueChange={setReceitaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma receita para adicionar" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingReceitas ? (
                    <SelectItem value="loading" disabled>
                      Carregando receitas...
                    </SelectItem>
                  ) : receitasDisponiveis.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Não há receitas disponíveis para adicionar
                    </SelectItem>
                  ) : (
                    receitasDisponiveis.map((receita) => (
                      <SelectItem key={receita.id} value={receita.id.toString()}>
                        {receita.nomeReceita}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdicionarReceita} disabled={isAdicionando || !receitaSelecionada}>
              <Plus className="h-4 w-4 mr-2" /> {isAdicionando ? "Adicionando..." : "Adicionar Receita"}
            </Button>
          </div>

          {livro.receitas && livro.receitas.length > 0 ? (
            <div className="border rounded-md divide-y">
              {livro.receitas.map((receita) => (
                <div key={receita.id} className="flex justify-between items-center p-4">
                  <Link href={`/receitas/${receita.id}`} className="hover:underline">
                    {receita.nomeReceita}
                  </Link>
                  <DeleteConfirmation
                    title="Remover receita"
                    description="Tem certeza que deseja remover esta receita do livro? Esta ação não pode ser desfeita."
                    onDelete={() => handleRemoverReceita(receita.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">Nenhuma receita adicionada a este livro.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
