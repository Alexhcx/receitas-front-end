"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Teste {
  id: number
  dataTeste: string
  nota: number
  degustadorRg: number
  nomeDegustador: string
  receitaId: number
  nomeReceita: string
}

export default function TestesPage() {
  const { data: testes, loading, deleteItem } = useDataFetching<Teste>("/testes", "Testes")

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      return dateString
    }
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nomeReceita",
      header: "Receita",
    },
    {
      accessorKey: "nomeDegustador",
      header: "Degustador",
    },
    {
      accessorKey: "dataTeste",
      header: "Data do Teste",
      cell: ({ row }) => formatDate(row.original.dataTeste),
    },
    {
      accessorKey: "nota",
      header: "Nota",
      cell: ({ row }) => `${row.original.nota.toFixed(1)}/10`,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const teste = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/testes/${teste.id}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir teste"
              description="Tem certeza que deseja excluir este teste? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(teste.id)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testes</h1>
        <Link href="/testes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Teste
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Testes</CardTitle>
          <CardDescription>Gerencie os testes de receitas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando testes...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={testes}
              searchColumn="nomeReceita"
              searchPlaceholder="Filtrar por receita..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
