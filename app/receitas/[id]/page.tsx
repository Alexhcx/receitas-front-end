"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Pencil } from "lucide-react"

interface ReceitaIngrediente {
  ingredienteId: number
  quantidade: number
  medida: string
}

interface Receita {
  id: number
  nomeReceita: string
  descricaoModoPreparo: string
  dataCriacao: string
  numeroPorcoes: number
  cozinheiroRg: number
  nomeCozinheiro: string
  categoriaId: number
  nomeCategoria: string
  ingredientes: ReceitaIngrediente[]
}

export default function DetalhesReceitaPage({ params }: { params: { id: string } }) {
  const [receita, setReceita] = useState<Receita | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id

  useEffect(() => {
    const loadReceita = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Receita>(`/receitas/${id}`)
        setReceita(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar receita",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados da receita.",
          variant: "destructive",
        })
        router.push("/receitas")
      } finally {
        setIsLoading(false)
      }
    }

    loadReceita()
  }, [id, router, toast])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (error) {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Detalhes da Receita</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados da receita...</p>
        </div>
      </div>
    )
  }

  if (!receita) {
    return (
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Detalhes da Receita</h1>
        <div className="flex justify-center items-center h-64">
          <p>Receita não encontrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{receita.nomeReceita}</h1>
        <div className="flex gap-2">
          <Link href="/receitas">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </Link>
          <Link href={`/receitas/${receita.id}/editar`}>
            <Button>
              <Pencil className="h-4 w-4 mr-2" /> Editar
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Detalhes básicos da receita</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Categoria</p>
            <p>{receita.nomeCategoria}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cozinheiro</p>
            <p>{receita.nomeCozinheiro}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
            <p>{formatDate(receita.dataCriacao)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Número de Porções</p>
            <p>{receita.numeroPorcoes}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ingredientes</CardTitle>
          <CardDescription>Lista de ingredientes necessários</CardDescription>
        </CardHeader>
        <CardContent>
          {receita.ingredientes && receita.ingredientes.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {receita.ingredientes.map((ingrediente, index) => (
                <li key={index}>
                  {ingrediente.quantidade} {ingrediente.medida} (ID: {ingrediente.ingredienteId})
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum ingrediente cadastrado para esta receita.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modo de Preparo</CardTitle>
          <CardDescription>Instruções para preparar a receita</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line">{receita.descricaoModoPreparo}</div>
        </CardContent>
      </Card>
    </div>
  )
}
