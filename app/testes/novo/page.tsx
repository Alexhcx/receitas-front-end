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
import { Slider } from "@/components/ui/slider"

interface Degustador {
  degustadorRg: number
  nomeEmpregado: string
}

interface Receita {
  id: number
  nomeReceita: string
}

export default function NovoTestePage() {
  const [degustadores, setDegustadores] = useState<Degustador[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(true)

  const [dataTeste, setDataTeste] = useState("")
  const [nota, setNota] = useState<number[]>([5])
  const [degustadorRg, setDegustadorRg] = useState("")
  const [receitaId, setReceitaId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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

        // Define a data atual como padrão
        setDataTeste(new Date().toISOString().split("T")[0])
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

    loadDependencies()
  }, [toast])

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
      await postData("/testes", {
        dataTeste,
        nota: nota[0],
        degustadorRg: Number(degustadorRg),
        receitaId: Number(receitaId),
      })

      toast({
        title: "Teste criado",
        description: "O teste foi criado com sucesso.",
      })

      router.push("/testes")
    } catch (error) {
      toast({
        title: "Erro ao criar teste",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o teste.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Novo Teste</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Teste</CardTitle>
            <CardDescription>Crie um novo teste de receita</CardDescription>
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
              {isLoadingDependencies ? (
                <p>Carregando degustadores...</p>
              ) : (
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
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receitaId">Receita</Label>
              {isLoadingDependencies ? (
                <p>Carregando receitas...</p>
              ) : (
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
              )}
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
