"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

interface Restaurante {
  id: number
  nomeRestaurante: string
  cozinheiroRg: number
  nomeCozinheiro: string
}

export default function RestaurantesPage() {
  const { data: restaurantes, loading, deleteItem } = useDataFetching<Restaurante>("/restaurantes", "Restaurantes")

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nomeRestaurante",
      header: "Nome do Restaurante",
    },
    {
      accessorKey: "nomeCozinheiro",
      header: "Cozinheiro",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const restaurante = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/restaurantes/${restaurante.id}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir restaurante"
              description="Tem certeza que deseja excluir este restaurante? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(restaurante.id)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurantes</h1>
        <Link href="/restaurantes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Restaurante
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Restaurantes</CardTitle>
          <CardDescription>Gerencie os restaurantes do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando restaurantes...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={restaurantes}
              searchColumn="nomeRestaurante"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
