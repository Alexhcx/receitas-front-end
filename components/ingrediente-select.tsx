"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Plus, X } from "lucide-react"

interface Ingrediente {
  id: number
  nomeIngrediente: string
}

export interface ReceitaIngrediente {
  ingredienteId: number
  quantidade: number
  medida: string
}

interface IngredienteSelectProps {
  value: ReceitaIngrediente[]
  onChange: (value: ReceitaIngrediente[]) => void
}

export function IngredienteSelect({ value, onChange }: IngredienteSelectProps) {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Estado temporário para o novo ingrediente
  const [novoIngrediente, setNovoIngrediente] = useState<{
    ingredienteId: string
    quantidade: string
    medida: string
  }>({
    ingredienteId: "",
    quantidade: "",
    medida: "",
  })

  useEffect(() => {
    const loadIngredientes = async () => {
      try {
        setIsLoading(true)
        const data = await fetchData<Ingrediente[]>("/ingredientes")
        setIngredientes(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar ingredientes",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar a lista de ingredientes.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadIngredientes()
  }, [toast])

  const handleAddIngrediente = () => {
    if (!novoIngrediente.ingredienteId || !novoIngrediente.quantidade || !novoIngrediente.medida) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos do ingrediente são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Verifica se o ingrediente já foi adicionado
    const ingredienteExistente = value.find((item) => item.ingredienteId === Number(novoIngrediente.ingredienteId))

    if (ingredienteExistente) {
      toast({
        title: "Ingrediente já adicionado",
        description: "Este ingrediente já foi adicionado à receita.",
        variant: "destructive",
      })
      return
    }

    const novoItem: ReceitaIngrediente = {
      ingredienteId: Number(novoIngrediente.ingredienteId),
      quantidade: Number(novoIngrediente.quantidade),
      medida: novoIngrediente.medida,
    }

    onChange([...value, novoItem])

    // Limpa o formulário
    setNovoIngrediente({
      ingredienteId: "",
      quantidade: "",
      medida: "",
    })
  }

  const handleRemoveIngrediente = (index: number) => {
    const novosIngredientes = [...value]
    novosIngredientes.splice(index, 1)
    onChange(novosIngredientes)
  }

  const getNomeIngrediente = (id: number) => {
    const ingrediente = ingredientes.find((i) => i.id === id)
    return ingrediente ? ingrediente.nomeIngrediente : `Ingrediente ${id}`
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="ingredienteId">Ingrediente</Label>
          {isLoading ? (
            <p>Carregando ingredientes...</p>
          ) : (
            <Select
              value={novoIngrediente.ingredienteId}
              onValueChange={(value) => setNovoIngrediente({ ...novoIngrediente, ingredienteId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ingrediente" />
              </SelectTrigger>
              <SelectContent>
                {ingredientes.map((ingrediente) => (
                  <SelectItem key={ingrediente.id} value={ingrediente.id.toString()}>
                    {ingrediente.nomeIngrediente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            step="0.01"
            min="0.01"
            value={novoIngrediente.quantidade}
            onChange={(e) => setNovoIngrediente({ ...novoIngrediente, quantidade: e.target.value })}
            placeholder="Ex: 100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medida">Medida</Label>
          <Input
            id="medida"
            value={novoIngrediente.medida}
            onChange={(e) => setNovoIngrediente({ ...novoIngrediente, medida: e.target.value })}
            placeholder="Ex: gramas, ml, unidades"
          />
        </div>
      </div>

      <Button type="button" onClick={handleAddIngrediente} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Adicionar Ingrediente
      </Button>

      {value.length > 0 && (
        <div className="border rounded-md p-4 mt-4">
          <h4 className="font-medium mb-2">Ingredientes Adicionados</h4>
          <ul className="space-y-2">
            {value.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                <span>
                  {getNomeIngrediente(item.ingredienteId)} - {item.quantidade} {item.medida}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveIngrediente(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
