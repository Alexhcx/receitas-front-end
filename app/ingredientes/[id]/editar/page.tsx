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
import { fetchData, updateData } from "@/lib/api"
import Link from "next/link"

interface Ingrediente {
  id: number
  nomeIngrediente: string
  descricaoIngrediente: string
}

export default function EditarIngredientePage({ params }: { params: { id: string } }) {
  const [ingrediente, setIngrediente] = useState<Ingrediente | null>(null)
  const [nomeIngrediente, setNomeIngrediente] = useState("")
  const [descricaoIngrediente, setDescricaoIngrediente] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id

  useEffect(() => {
    const loadIngrediente = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Ingrediente>(`/ingredientes/${id}`)
        setIngrediente(data)
        setNomeIngrediente(data.nomeIngrediente)
        setDescricaoIngrediente(data.descricaoIngrediente)
      } catch (error) {
        toast({
          title: "Erro ao carregar ingrediente",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do ingrediente.",
          variant: "destructive",
        })
        router.push("/ingredientes")
      } finally {
        setIsLoading(false)
      }
    }

    loadIngrediente()
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeIngrediente.trim() || !descricaoIngrediente.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/ingredientes/${id}`, {
        nomeIngrediente,
        descricaoIngrediente,
      })

      toast({
        title: "Ingrediente atualizado",
        description: "O ingrediente foi atualizado com sucesso.",
      })

      router.push("/ingredientes")
    } catch (error) {
      toast({
        title: "Erro ao atualizar ingrediente",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o ingrediente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Ingrediente</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do ingrediente...</p>
        </div>
      </div>
    )
  }

  if (!ingrediente) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Ingrediente</h1>
        <div className="flex justify-center items-center h-64">
          <p>Ingrediente não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Ingrediente</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Ingrediente</CardTitle>
            <CardDescription>Atualize as informações do ingrediente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeIngrediente">Nome do Ingrediente</Label>
              <Input
                id="nomeIngrediente"
                value={nomeIngrediente}
                onChange={(e) => setNomeIngrediente(e.target.value)}
                placeholder="Digite o nome do ingrediente"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricaoIngrediente">Descrição</Label>
              <Textarea
                id="descricaoIngrediente"
                value={descricaoIngrediente}
                onChange={(e) => setDescricaoIngrediente(e.target.value)}
                placeholder="Digite a descrição do ingrediente"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/ingredientes">
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
