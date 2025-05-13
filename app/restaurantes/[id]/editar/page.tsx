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

interface Cozinheiro {
  cozinheiroRg: number
  nomeEmpregado: string
  nomeFantasia: string | null
}

interface Restaurante {
  id: number
  nomeRestaurante: string
  cozinheiroRg: number
  nomeCozinheiro: string
}

export default function EditarRestaurantePage({ params }: { params: { id: string } }) {
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null)
  const [cozinheiros, setCozinheiros] = useState<Cozinheiro[]>([])
  const [isLoadingCozinheiros, setIsLoadingCozinheiros] = useState(true)
  const [isLoadingRestaurante, setIsLoadingRestaurante] = useState(true)

  const [nomeRestaurante, setNomeRestaurante] = useState("")
  const [cozinheiroRg, setCozinheiroRg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id

  useEffect(() => {
    const loadCozinheiros = async () => {
      try {
        setIsLoadingCozinheiros(true)
        const data = await fetchData<Cozinheiro[]>("/cozinheiros")
        setCozinheiros(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar cozinheiros",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar a lista de cozinheiros.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCozinheiros(false)
      }
    }

    const loadRestaurante = async () => {
      try {
        setIsLoadingRestaurante(true)
        const data = await fetchData<Restaurante>(`/restaurantes/${id}`)
        setRestaurante(data)
        setNomeRestaurante(data.nomeRestaurante)
        setCozinheiroRg(data.cozinheiroRg.toString())
      } catch (error) {
        toast({
          title: "Erro ao carregar restaurante",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do restaurante.",
          variant: "destructive",
        })
        router.push("/restaurantes")
      } finally {
        setIsLoadingRestaurante(false)
      }
    }

    loadCozinheiros()
    loadRestaurante()
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeRestaurante.trim() || !cozinheiroRg) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/restaurantes/${id}`, {
        nomeRestaurante,
        cozinheiroRg: Number(cozinheiroRg),
      })

      toast({
        title: "Restaurante atualizado",
        description: "O restaurante foi atualizado com sucesso.",
      })

      router.push("/restaurantes")
    } catch (error) {
      toast({
        title: "Erro ao atualizar restaurante",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o restaurante.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingRestaurante || isLoadingCozinheiros) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Restaurante</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do restaurante...</p>
        </div>
      </div>
    )
  }

  if (!restaurante) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Restaurante</h1>
        <div className="flex justify-center items-center h-64">
          <p>Restaurante não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Restaurante</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Restaurante</CardTitle>
            <CardDescription>Atualize as informações do restaurante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeRestaurante">Nome do Restaurante</Label>
              <Input
                id="nomeRestaurante"
                value={nomeRestaurante}
                onChange={(e) => setNomeRestaurante(e.target.value)}
                placeholder="Digite o nome do restaurante"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cozinheiroRg">Cozinheiro</Label>
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/restaurantes">
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
