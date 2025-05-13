"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { fetchData, postData } from "@/lib/api"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface Empregado {
  empregadoRg: number
  nomeEmpregado: string
}

export default function NovoEditorPage() {
  const [empregados, setEmpregados] = useState<Empregado[]>([])
  const [editorRg, setEditorRg] = useState("")
  const [dtContrato, setDtContrato] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEmpregados, setIsLoadingEmpregados] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadEmpregados = async () => {
      try {
        setIsLoadingEmpregados(true)
        const data = await fetchData<Empregado[]>("/empregados")
        setEmpregados(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar empregados",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar a lista de empregados.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingEmpregados(false)
      }
    }

    loadEmpregados()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editorRg) {
      toast({
        title: "Campo obrigatório",
        description: "Você precisa selecionar um empregado.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await postData("/editores", {
        editorRg: Number(editorRg),
        dtContrato: dtContrato ? dtContrato.toISOString().split("T")[0] : null,
      })

      toast({
        title: "Editor criado",
        description: "O editor foi criado com sucesso.",
      })

      router.push("/editores")
    } catch (error) {
      toast({
        title: "Erro ao criar editor",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o editor.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Novo Editor</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Editor</CardTitle>
            <CardDescription>Crie um novo registro de editor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editorRg">Empregado</Label>
              {isLoadingEmpregados ? (
                <p>Carregando empregados...</p>
              ) : (
                <Select onValueChange={setEditorRg} value={editorRg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um empregado" />
                  </SelectTrigger>
                  <SelectContent>
                    {empregados.map((empregado) => (
                      <SelectItem key={empregado.empregadoRg} value={empregado.empregadoRg.toString()}>
                        {empregado.nomeEmpregado} (RG: {empregado.empregadoRg})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
            <Link href="/editores">
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
