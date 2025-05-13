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

interface Degustador {
  degustadorRg: number
  nomeEmpregado: string
  dtContrato: string | null
}

export default function EditarDegustadorPage({ params }: { params: { rg: string } }) {
  const [degustador, setDegustador] = useState<Degustador | null>(null)
  const [dtContrato, setDtContrato] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const rg = params.rg

  useEffect(() => {
    const loadDegustador = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Degustador>(`/degustadores/${rg}`)
        setDegustador(data)
        setDtContrato(data.dtContrato ? new Date(data.dtContrato) : undefined)
      } catch (error) {
        toast({
          title: "Erro ao carregar degustador",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do degustador.",
          variant: "destructive",
        })
        router.push("/degustadores")
      } finally {
        setIsLoading(false)
      }
    }

    loadDegustador()
  }, [rg, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      await updateData(`/degustadores/${rg}`, {
        degustadorRg: Number(rg),
        dtContrato: dtContrato ? dtContrato.toISOString().split("T")[0] : null,
      })

      toast({
        title: "Degustador atualizado",
        description: "O degustador foi atualizado com sucesso.",
      })

      router.push("/degustadores")
    } catch (error) {
      toast({
        title: "Erro ao atualizar degustador",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o degustador.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Degustador</h1>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do degustador...</p>
        </div>
      </div>
    )
  }

  if (!degustador) {
    return (
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Editar Degustador</h1>
        <div className="flex justify-center items-center h-64">
          <p>Degustador não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Degustador</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Editar Degustador</CardTitle>
            <CardDescription>Atualize as informações do degustador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="degustadorRg">RG do Degustador</Label>
              <Input id="degustadorRg" value={rg} disabled />
              <p className="text-sm text-muted-foreground">O RG não pode ser alterado.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeEmpregado">Nome do Empregado</Label>
              <Input id="nomeEmpregado" value={degustador.nomeEmpregado} disabled />
              <p className="text-sm text-muted-foreground">O nome do empregado não pode ser alterado aqui.</p>
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
            <Link href="/degustadores">
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
