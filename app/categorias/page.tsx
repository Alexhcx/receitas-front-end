"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

interface Categoria {
  id: number
  nomeCategoria: string
}

export default function CategoriasPage() {
  const { data: categorias, loading, deleteItem } = useDataFetching<Categoria>("/categorias", "Categorias")

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nomeCategoria",
      header: "Nome da Categoria",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const categoria = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/categorias/${categoria.id}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir categoria"
              description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(categoria.id)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Link href="/categorias/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Categoria
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>Gerencie as categorias de receitas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando categorias...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categorias}
              searchColumn="nomeCategoria"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
