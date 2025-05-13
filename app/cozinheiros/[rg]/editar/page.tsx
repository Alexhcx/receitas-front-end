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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Cozinheiro {
  cozinheiroRg: number
  nomeEmpregado: string
  nomeFantasia: string | null
  metaMensalReceitas: number
  prazoInicialDias: number
  dtContrato: string | null
}

export default function EditarCozinheiroPage({ params }: { params: { rg: string } }) {
  const [cozinheiro, setCozinheiro] = useState<Cozinheiro | null>(null)
  const [nomeFantasia, setNomeFantasia] = useState("")
  const [metaMensalReceitas, setMetaMensalReceitas] = useState("")
  const [prazoInicialDias, setPrazoInicialDias] = useState("")
  const [dtContrato, setDtContrato] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const rg = params.rg

  useEffect(() => {
    const loadCozinheiro = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Cozinheiro>(`/cozinheiros/${rg}`)
        setCozinheiro(data)
        setNomeFantasia(data.nomeFantasia || "")
        setMetaMensalReceitas(data.metaMensalReceitas.toString())
        setPrazoInicialDias(data.prazoInicialDias.toString())
        setDtContrato(data.dtContrato ? new Date(data.dtContrato) : undefined)
      } catch (error) {
        toast({
          title: "Erro ao carregar cozinheiro",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do cozinheiro.",
          variant: "destructive",
        })
        router.push("/cozinheiros")
      } finally {
        setIsLoading(false)
      }
    }

    loadCozinheiro()
  }, [rg, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!metaMensalReceitas || !prazoInicialDias) {
      toast({
        title: "Campos obrigatórios",
        description: "Meta mensal e prazo inicial são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateData(`/cozinheiros/${rg}`, {
        cozinheiroRg: Number(rg),
        nomeFantasia: nomeFantasia || null,
        metaMensalReceitas: Number(metaMensalReceitas),
        prazoInicialDias: Number(prazoInicialDias),
        dtContrato: dtContrato ? dtContrato.toISOString().split("T")[0] : null,
      })

      toast({
        title: "Cozinheiro atualizado",
        description: "O cozinheiro foi atualizado com sucesso.",
      })

      router.push("/cozinheiros")
    } catch (error) {
      toast({
        title: "Erro ao atualizar cozinheiro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o cozinheiro.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Cozinheiro</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do cozinheiro...</p>
        </div>
      </div>
    )
  }

  if (!cozinheiro) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Cozinheiro</h1>
        <div className="flex justify-center items-center h-64">
          <p>Cozinheiro não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Cozinheiro</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Cozinheiro</CardTitle>
            <CardDescription>Atualize as informações do cozinheiro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cozinheiroRg">RG do Cozinheiro</Label>
              <Input id="cozinheiroRg" value={rg} disabled />
              <p className="text-sm text-muted-foreground">O RG não pode ser alterado.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeEmpregado">Nome do Empregado</Label>
              <Input id="nomeEmpregado" value={cozinheiro.nomeEmpregado} disabled />
              <p className="text-sm text-muted-foreground">O nome do empregado não pode ser alterado aqui.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia (opcional)</Label>
              <Input
                id="nomeFantasia"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                placeholder="Digite o nome fantasia do cozinheiro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaMensalReceitas">Meta Mensal de Receitas</Label>
              <Input
                id="metaMensalReceitas"
                type="number"
                min="1"
                value={metaMensalReceitas}
                onChange={(e) => setMetaMensalReceitas(e.target.value)}
                placeholder="Digite a meta mensal de receitas"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoInicialDias">Prazo Inicial (dias)</Label>
              <Input
                id="prazoInicialDias"
                type="number"
                min="0"
                max="45"
                value={prazoInicialDias}
                onChange={(e) => setPrazoInicialDias(e.target.value)}
                placeholder="Digite o prazo inicial em dias"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dtContrato">Data de Contrato</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dtContrato && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dtContrato ? format(dtContrato, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dtContrato} onSelect={setDtContrato} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/cozinheiros">
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
