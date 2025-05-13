"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

interface Editor {
  editorRg: number
  nomeEmpregado: string
  dtContrato: string | null
}

export default function EditoresPage() {
  const { data: editores, loading, deleteItem } = useDataFetching<Editor>("/editores", "Editores", "editorRg")

  const columns = [
    {
      accessorKey: "editorRg",
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
        const editor = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/editores/${editor.editorRg}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir editor"
              description="Tem certeza que deseja excluir este editor? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(editor.editorRg)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editores</h1>
        <Link href="/editores/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Editor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Editores</CardTitle>
          <CardDescription>Gerencie os editores do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando editores...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={editores}
              searchColumn="nomeEmpregado"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
