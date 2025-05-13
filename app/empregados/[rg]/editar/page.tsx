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

interface Empregado {
  empregadoRg: number
  nomeEmpregado: string
  dataAdmissao: string
  salario: number
}

export default function EditarEmpregadoPage({ params }: { params: { rg: string } }) {
  const [empregado, setEmpregado] = useState<Empregado | null>(null)
  const [nomeEmpregado, setNomeEmpregado] = useState("")
  const [dataAdmissao, setDataAdmissao] = useState("")
  const [salario, setSalario] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const rg = params.rg

  useEffect(() => {
    const loadEmpregado = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Empregado>(`/empregados/${rg}`)
        setEmpregado(data)
        setNomeEmpregado(data.nomeEmpregado)
        setDataAdmissao(data.dataAdmissao.split("T")[0]) // Formata a data para o formato YYYY-MM-DD
        setSalario(data.salario.toString())
      } catch (error) {
        toast({
          title: "Erro ao carregar empregado",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do empregado.",
          variant: "destructive",
        })
        router.push("/empregados")
      } finally {
        setIsLoading(false)
      }
    }

    loadEmpregado()
  }, [rg, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeEmpregado.trim() || !dataAdmissao || !salario) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/empregados/${rg}`, {
        empregadoRg: Number(rg),
        nomeEmpregado,
        dataAdmissao,
        salario: Number(salario),
      })

      toast({
        title: "Empregado atualizado",
        description: "O empregado foi atualizado com sucesso.",
      })

      router.push("/empregados")
    } catch (error) {
      toast({
        title: "Erro ao atualizar empregado",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o empregado.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Empregado</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do empregado...</p>
        </div>
      </div>
    )
  }

  if (!empregado) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Empregado</h1>
        <div className="flex justify-center items-center h-64">
          <p>Empregado não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Empregado</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Empregado</CardTitle>
            <CardDescription>Atualize as informações do empregado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empregadoRg">RG do Empregado</Label>
              <Input id="empregadoRg" type="number" value={rg} disabled />
              <p className="text-sm text-muted-foreground">O RG não pode ser alterado.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeEmpregado">Nome do Empregado</Label>
              <Input
                id="nomeEmpregado"
                value={nomeEmpregado}
                onChange={(e) => setNomeEmpregado(e.target.value)}
                placeholder="Digite o nome do empregado"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataAdmissao">Data de Admissão</Label>
              <Input
                id="dataAdmissao"
                type="date"
                value={dataAdmissao}
                onChange={(e) => setDataAdmissao(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salario">Salário</Label>
              <Input
                id="salario"
                type="number"
                step="0.01"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="Digite o salário do empregado"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/empregados">
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
