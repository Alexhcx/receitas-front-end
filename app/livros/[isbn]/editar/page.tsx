"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { fetchData, updateData } from "@/lib/api"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Editor {
  editorRg: number
  nomeEmpregado: string
}

interface Livro {
  isbn: string
  titulo: string
  editorRg: number
  nomeEditor: string
}

export default function EditarLivroPage({ params }: { params: { isbn: string } }) {
  const [livro, setLivro] = useState<Livro | null>(null)
  const [editores, setEditores] = useState<Editor[]>([])
  const [isLoadingEditores, setIsLoadingEditores] = useState(true)
  const [isLoadingLivro, setIsLoadingLivro] = useState(true)

  const [titulo, setTitulo] = useState("")
  const [editorRg, setEditorRg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isbn = params.isbn

  useEffect(() => {
    const loadEditores = async () => {
      try {
        setIsLoadingEditores(true)
        const data = await fetchData<Editor[]>("/editores")
        setEditores(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar editores",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar a lista de editores.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingEditores(false)
      }
    }

    const loadLivro = async () => {
      try {
        setIsLoadingLivro(true)
        const data = await fetchData<Livro>(`/livros/${isbn}`)
        setLivro(data)
        setTitulo(data.titulo)
        setEditorRg(data.editorRg.toString())
      } catch (error) {
        toast({
          title: "Erro ao carregar livro",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do livro.",
          variant: "destructive",
        })
        router.push("/livros")
      } finally {
        setIsLoadingLivro(false)
      }
    }

    loadEditores()
    loadLivro()
  }, [isbn, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !editorRg) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/livros/${isbn}`, {
        isbn,
        titulo,
        editorRg: Number(editorRg),
      })

      toast({
        title: "Livro atualizado",
        description: "O livro foi atualizado com sucesso.",
      })

      router.push("/livros")
    } catch (error) {
      toast({
        title: "Erro ao atualizar livro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o livro.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingLivro || isLoadingEditores) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Livro</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do livro...</p>
        </div>
      </div>
    )
  }

  if (!livro) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Livro</h1>
        <div className="flex justify-center items-center h-64">
          <p>Livro não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Livro</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Livro</CardTitle>
            <CardDescription>Atualize as informações do livro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" value={isbn} disabled />
              <p className="text-sm text-muted-foreground">O ISBN não pode ser alterado.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título do livro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editorRg">Editor</Label>
              <Select onValueChange={setEditorRg} value={editorRg}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um editor" />
                </SelectTrigger>
                <SelectContent>
                  {editores.map((editor) => (
                    <SelectItem key={editor.editorRg} value={editor.editorRg.toString()}>
                      {editor.nomeEmpregado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/livros">
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
