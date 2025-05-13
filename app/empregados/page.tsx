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

interface Empregado {
  empregadoRg: number
  nomeEmpregado: string
  dataAdmissao: string
  salario: number
}

export default function EmpregadosPage() {
  const {
    data: empregados,
    loading,
    deleteItem,
  } = useDataFetching<Empregado>("/empregados", "Empregados", "empregadoRg")

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      return dateString
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const columns = [
    {
      accessorKey: "empregadoRg",
      header: "RG",
    },
    {
      accessorKey: "nomeEmpregado",
      header: "Nome",
    },
    {
      accessorKey: "dataAdmissao",
      header: "Data de Admissão",
      cell: ({ row }) => formatDate(row.original.dataAdmissao),
    },
    {
      accessorKey: "salario",
      header: "Salário",
      cell: ({ row }) => formatCurrency(row.original.salario),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const empregado = row.original

        return (
          <div className="flex items-center gap-2">
            <Link href={`/empregados/${empregado.empregadoRg}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmation
              title="Excluir empregado"
              description="Tem certeza que deseja excluir este empregado? Esta ação não pode ser desfeita."
              onDelete={() => deleteItem(empregado.empregadoRg)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empregados</h1>
        <Link href="/empregados/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Empregado
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empregados</CardTitle>
          <CardDescription>Gerencie os empregados do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando empregados...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={empregados}
              searchColumn="nomeEmpregado"
              searchPlaceholder="Filtrar por nome..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
