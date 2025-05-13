"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { postData } from "@/lib/api"
import Link from "next/link"

export default function NovoEmpregadoPage() {
  const [empregadoRg, setEmpregadoRg] = useState("")
  const [nomeEmpregado, setNomeEmpregado] = useState("")
  const [dataAdmissao, setDataAdmissao] = useState("")
  const [salario, setSalario] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!empregadoRg.trim() || !nomeEmpregado.trim() || !dataAdmissao || !salario) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await postData("/empregados", {
        empregadoRg: Number(empregadoRg),
        nomeEmpregado,
        dataAdmissao,
        salario: Number(salario),
      })

      toast({
        title: "Empregado criado",
        description: "O empregado foi criado com sucesso.",
      })

      router.push("/empregados")
    } catch (error) {
      toast({
        title: "Erro ao criar empregado",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o empregado.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Novo Empregado</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Empregado</CardTitle>
            <CardDescription>Crie um novo registro de empregado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empregadoRg">RG do Empregado</Label>
              <Input
                id="empregadoRg"
                type="number"
                value={empregadoRg}
                onChange={(e) => setEmpregadoRg(e.target.value)}
                placeholder="Digite o RG do empregado"
                required
              />
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
