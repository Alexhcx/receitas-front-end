"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

interface Ingrediente {
  id: number
  nomeIngrediente: string
  descricaoIngrediente: string
}

export default function IngredientesPage() {
  const { data: ingredientes, loading, deleteItem } = useDataFetching<Ingrediente>("/ingredientes", "Ingredientes")

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nomeIngrediente",
      header: "Nome do Ingrediente",
    },
    {
      accessorKey: "descricaoIngrediente",
      header: "Descrição",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ingrediente = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/ingredientes/${ingrediente.id}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir ingrediente"
              description="Tem certeza que deseja excluir este ingrediente? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(ingrediente.id)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredientes</h1>
        <Link href="/ingredientes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Ingrediente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ingredientes</CardTitle>
          <CardDescription>Gerencie os ingredientes disponíveis para as receitas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando ingredientes...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={ingredientes}
              searchColumn="nomeIngrediente"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
