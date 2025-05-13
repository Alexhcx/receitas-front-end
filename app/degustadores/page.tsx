"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

// Atualizar a interface Degustador para incluir dtContrato
interface Degustador {
  degustadorRg: number
  nomeEmpregado: string
  dtContrato: string | null
}

export default function DegustadoresPage() {
  const {
    data: degustadores,
    loading,
    deleteItem,
  } = useDataFetching<Degustador>("/degustadores", "Degustadores", "degustadorRg")

  // Adicionar a coluna de data de contrato na tabela
  const columns = [
    {
      accessorKey: "degustadorRg",
      header: "RG",
    },
    {
      accessorKey: "nomeEmpregado",
      header: "Nome",
    },
    {
      accessorKey: "dtContrato",
      header: "Data de Contrato",
      cell: ({ row }) => {
        const date = row.original.dtContrato
        if (!date) return "-"
        return new Date(date).toLocaleDateString("pt-BR")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const degustador = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/degustadores/${degustador.degustadorRg}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir degustador"
              description="Tem certeza que deseja excluir este degustador? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(degustador.degustadorRg)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Degustadores</h1>
        <Link href="/degustadores/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Degustador
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Degustadores</CardTitle>
          <CardDescription>Gerencie os degustadores do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando degustadores...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={degustadores}
              searchColumn="nomeEmpregado"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
