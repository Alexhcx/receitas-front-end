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

interface Categoria {
  id: number
  nomeCategoria: string
}

export default function EditarCategoriaPage({ params }: { params: { id: string } }) {
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [nomeCategoria, setNomeCategoria] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id

  useEffect(() => {
    const loadCategoria = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Categoria>(`/categorias/${id}`)
        setCategoria(data)
        setNomeCategoria(data.nomeCategoria)
      } catch (error) {
        toast({
          title: "Erro ao carregar categoria",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados da categoria.",
          variant: "destructive",
        })
        router.push("/categorias")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategoria()
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeCategoria.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/categorias/${id}`, { nomeCategoria })

      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      })

      router.push("/categorias")
    } catch (error) {
      toast({
        title: "Erro ao atualizar categoria",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a categoria.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Categoria</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados da categoria...</p>
        </div>
      </div>
    )
  }

  if (!categoria) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Categoria</h1>
        <div className="flex justify-center items-center h-64">
          <p>Categoria não encontrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Categoria</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Categoria</CardTitle>
            <CardDescription>Atualize as informações da categoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCategoria">Nome da Categoria</Label>
              <Input
                id="nomeCategoria"
                value={nomeCategoria}
                onChange={(e) => setNomeCategoria(e.target.value)}
                placeholder="Digite o nome da categoria"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/categorias">
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
