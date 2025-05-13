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
import { Slider } from "@/components/ui/slider"

interface Degustador {
  degustadorRg: number
  nomeEmpregado: string
}

interface Receita {
  id: number
  nomeReceita: string
}

interface Teste {
  id: number
  dataTeste: string
  nota: number
  degustadorRg: number
  nomeDegustador: string
  receitaId: number
  nomeReceita: string
}

export default function EditarTestePage({ params }: { params: { id: string } }) {
  const [teste, setTeste] = useState<Teste | null>(null)
  const [degustadores, setDegustadores] = useState<Degustador[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(true)
  const [isLoadingTeste, setIsLoadingTeste] = useState(true)

  const [dataTeste, setDataTeste] = useState("")
  const [nota, setNota] = useState<number[]>([5])
  const [degustadorRg, setDegustadorRg] = useState("")
  const [receitaId, setReceitaId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        setIsLoadingDependencies(true)
        const [degustadoresData, receitasData] = await Promise.all([
          fetchData<Degustador[]>("/degustadores"),
          fetchData<Receita[]>("/receitas"),
        ])
        setDegustadores(degustadoresData)
        setReceitas(receitasData)
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

    const loadTeste = async () => {
      try {
        setIsLoadingTeste(true)
        const data = await fetchData<Teste>(`/testes/${id}`)
        setTeste(data)
        setDataTeste(data.dataTeste.split("T")[0])
        setNota([data.nota])
        setDegustadorRg(data.degustadorRg.toString())
        setReceitaId(data.receitaId.toString())
      } catch (error) {
        toast({
          title: "Erro ao carregar teste",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do teste.",
          variant: "destructive",
        })
        router.push("/testes")
      } finally {
        setIsLoadingTeste(false)
      }
    }

    loadDependencies()
    loadTeste()
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dataTeste || !degustadorRg || !receitaId) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/testes/${id}`, {
        dataTeste,
        nota: nota[0],
        degustadorRg: Number(degustadorRg),
        receitaId: Number(receitaId),
      })

      toast({
        title: "Teste atualizado",
        description: "O teste foi atualizado com sucesso.",
      })

      router.push("/testes")
    } catch (error) {
      toast({
        title: "Erro ao atualizar teste",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o teste.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingTeste || isLoadingDependencies) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Teste</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do teste...</p>
        </div>
      </div>
    )
  }

  if (!teste) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Teste</h1>
        <div className="flex justify-center items-center h-64">
          <p>Teste não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Teste</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Teste</CardTitle>
            <CardDescription>Atualize as informações do teste</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataTeste">Data do Teste</Label>
              <Input
                id="dataTeste"
                type="date"
                value={dataTeste}
                onChange={(e) => setDataTeste(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degustadorRg">Degustador</Label>
              <Select onValueChange={setDegustadorRg} value={degustadorRg}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um degustador" />
                </SelectTrigger>
                <SelectContent>
                  {degustadores.map((degustador) => (
                    <SelectItem key={degustador.degustadorRg} value={degustador.degustadorRg.toString()}>
                      {degustador.nomeEmpregado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receitaId">Receita</Label>
              <Select onValueChange={setReceitaId} value={receitaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma receita" />
                </SelectTrigger>
                <SelectContent>
                  {receitas.map((receita) => (
                    <SelectItem key={receita.id} value={receita.id.toString()}>
                      {receita.nomeReceita}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nota">Nota (0-10)</Label>
              <div className="pt-6 pb-2">
                <Slider id="nota" min={0} max={10} step={0.5} value={nota} onValueChange={setNota} />
              </div>
              <div className="text-center font-bold text-xl">{nota[0].toFixed(1)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/testes">
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
