"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchData, deleteData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function useDataFetching<T>(endpoint: string, entityName: string, idField = "id") {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [isDataFetched, setIsDataFetched] = useState(false)
  const { toast } = useToast()

  const loadData = useCallback(async () => {
    if (isDataFetched) return

    try {
      setLoading(true)
      const fetchedData = await fetchData<T[]>(endpoint)
      setData(fetchedData)
      toast({
        title: `${entityName} carregados`,
        description: `${fetchedData.length} ${entityName.toLowerCase()} foram carregados com sucesso.`,
      })
      setIsDataFetched(true)
    } catch (error) {
      toast({
        title: `Erro ao carregar ${entityName.toLowerCase()}`,
        description:
          error instanceof Error ? error.message : `Ocorreu um erro ao carregar os ${entityName.toLowerCase()}.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [endpoint, entityName, isDataFetched, toast])

  const deleteItem = useCallback(
    async (id: string | number) => {
      try {
        await deleteData(`${endpoint}/${id}`)
        toast({
          title: `${entityName.slice(0, -1)} excluído`,
          description: `O ${entityName.toLowerCase().slice(0, -1)} foi excluído com sucesso.`,
        })

        // Atualiza a lista após excluir
        const updatedData = data.filter((item: any) => item[idField] !== id)
        setData(updatedData)
      } catch (error) {
        toast({
          title: `Erro ao excluir ${entityName.toLowerCase().slice(0, -1)}`,
          description:
            error instanceof Error
              ? error.message
              : `Ocorreu um erro ao excluir o ${entityName.toLowerCase().slice(0, -1)}.`,
          variant: "destructive",
        })
      }
    },
    [endpoint, entityName, data, idField, toast],
  )

  useEffect(() => {
    loadData()
  }, [loadData])

  const refreshData = useCallback(() => {
    setIsDataFetched(false)
    loadData()
  }, [loadData])

  return { data, loading, deleteItem, refreshData }
}
