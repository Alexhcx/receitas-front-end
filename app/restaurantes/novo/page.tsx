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

interface Cozinheiro {
  cozinheiroRg: number
  nomeEmpregado: string
  nomeFantasia: string | null
}

export default function NovoRestaurantePage() {
  const [cozinheiros, setCozinheiros] = useState<Cozinheiro[]>([])
  const [isLoadingCozinheiros, setIsLoadingCozinheiros] = useState(true)

  const [nomeRestaurante, setNomeRestaurante] = useState("")
  const [cozinheiroRg, setCozinheiroRg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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

    loadCozinheiros()
  }, [toast])

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
      await postData("/restaurantes", {
        nomeRestaurante,
        cozinheiroRg: Number(cozinheiroRg),
      })

      toast({
        title: "Restaurante criado",
        description: "O restaurante foi criado com sucesso.",
      })

      router.push("/restaurantes")
    } catch (error) {
      toast({
        title: "Erro ao criar restaurante",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o restaurante.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Novo Restaurante</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Restaurante</CardTitle>
            <CardDescription>Crie um novo registro de restaurante</CardDescription>
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
              {isLoadingCozinheiros ? (
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
