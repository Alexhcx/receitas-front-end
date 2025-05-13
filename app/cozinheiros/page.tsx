"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Pencil, Plus } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataFetching } from "@/hooks/use-data-fetching"

interface Cozinheiro {
  cozinheiroRg: number
  nomeEmpregado: string
  nomeFantasia: string | null
  metaMensalReceitas: number
  prazoInicialDias: number
  dtContrato: string | null
}

export default function CozinheirosPage() {
  const {
    data: cozinheiros,
    loading,
    deleteItem,
  } = useDataFetching<Cozinheiro>("/cozinheiros", "Cozinheiros", "cozinheiroRg")

  const columns = [
    {
      accessorKey: "cozinheiroRg",
      header: "RG",
    },
    {
      accessorKey: "nomeEmpregado",
      header: "Nome",
    },
    {
      accessorKey: "nomeFantasia",
      header: "Nome Fantasia",
      cell: ({ row }) => row.original.nomeFantasia || "-",
    },
    {
      accessorKey: "metaMensalReceitas",
      header: "Meta Mensal",
    },
    {
      accessorKey: "prazoInicialDias",
      header: "Prazo Inicial (dias)",
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
        const cozinheiro = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/cozinheiros/${cozinheiro.cozinheiroRg}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir cozinheiro"
              description="Tem certeza que deseja excluir este cozinheiro? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(cozinheiro.cozinheiroRg)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cozinheiros</h1>
        <Link href="/cozinheiros/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Cozinheiro
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cozinheiros</CardTitle>
          <CardDescription>Gerencie os cozinheiros do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando cozinheiros...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={cozinheiros}
              searchColumn="nomeEmpregado"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
