"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { fetchData, postData } from "@/lib/api"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Editor {
  editorRg: number
  nomeEmpregado: string
}

export default function NovoLivroPage() {
  const [editores, setEditores] = useState<Editor[]>([])
  const [isLoadingEditores, setIsLoadingEditores] = useState(true)

  const [isbn, setIsbn] = useState("")
  const [titulo, setTitulo] = useState("")
  const [editorRg, setEditorRg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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

    loadEditores()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isbn.trim() || !titulo.trim() || !editorRg) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await postData("/livros", {
        isbn,
        titulo,
        editorRg: Number(editorRg),
      })

      toast({
        title: "Livro criado",
        description: "O livro foi criado com sucesso.",
      })

      router.push("/livros")
    } catch (error) {
      toast({
        title: "Erro ao criar livro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o livro.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Novo Livro</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Livro</CardTitle>
            <CardDescription>Crie um novo livro de receitas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Digite o ISBN do livro"
                required
              />
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
              {isLoadingEditores ? (
                <p>Carregando editores...</p>
              ) : (
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
              )}
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
