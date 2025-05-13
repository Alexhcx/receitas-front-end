"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { postData } from "@/lib/api"
import Link from "next/link"

export default function NovoIngredientePage() {
  const [nomeIngrediente, setNomeIngrediente] = useState("")
  const [descricaoIngrediente, setDescricaoIngrediente] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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
      await postData("/ingredientes", {
        nomeIngrediente,
        descricaoIngrediente,
      })

      toast({
        title: "Ingrediente criado",
        description: "O ingrediente foi criado com sucesso.",
      })

      router.push("/ingredientes")
    } catch (error) {
      toast({
        title: "Erro ao criar ingrediente",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o ingrediente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Novo Ingrediente</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Ingrediente</CardTitle>
            <CardDescription>Crie um novo ingrediente para usar nas receitas</CardDescription>
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
