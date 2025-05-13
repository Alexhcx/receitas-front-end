"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus, Eye } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Receita {
  id: number
  nomeReceita: string
  descricaoModoPreparo: string
  dataCriacao: string
  numeroPorcoes: number
  cozinheiroRg: number
  nomeCozinheiro: string
  categoriaId: number
  nomeCategoria: string
}

export default function ReceitasPage() {
  const { data: receitas, loading, deleteItem } = useDataFetching<Receita>("/receitas", "Receitas")

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
      header: "Nome da Receita",
    },
    {
      accessorKey: "nomeCategoria",
      header: "Categoria",
    },
    {
      accessorKey: "nomeCozinheiro",
      header: "Cozinheiro",
    },
    {
      accessorKey: "dataCriacao",
      header: "Data de Criação",
      cell: ({ row }) => formatDate(row.original.dataCriacao),
    },
    {
      accessorKey: "numeroPorcoes",
      header: "Porções",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const receita = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/receitas/${receita.id}`}>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/receitas/${receita.id}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir receita"
              description="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(receita.id)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receitas</h1>
        <Link href="/receitas/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Receita
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
          <CardDescription>Gerencie as receitas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando receitas...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={receitas}
              searchColumn="nomeReceita"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
