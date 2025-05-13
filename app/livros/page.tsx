"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus, Eye } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

interface Livro {
  isbn: string
  titulo: string
  editorRg: number
  nomeEditor: string
}

export default function LivrosPage() {
  const { data: livros, loading, deleteItem } = useDataFetching<Livro>("/livros", "Livros", "isbn")

  const columns = [
    {
      accessorKey: "isbn",
      header: "ISBN",
    },
    {
      accessorKey: "titulo",
      header: "Título",
    },
    {
      accessorKey: "nomeEditor",
      header: "Editor",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const livro = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/livros/${livro.isbn}`}>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/livros/${livro.isbn}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir livro"
              description="Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(livro.isbn)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Livros</h1>
        <Link href="/livros/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Livro
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Livros</CardTitle>
          <CardDescription>Gerencie os livros de receitas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando livros...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={livros}
              searchColumn="titulo"
              searchPlaceholder="Filtrar por título..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
