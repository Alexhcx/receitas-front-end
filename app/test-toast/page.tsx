"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function TestToastPage() {
  const { toast } = useToast()

  const showSuccessToast = () => {
    toast({
      title: "Operação bem-sucedida",
      description: "Esta é uma notificação de sucesso de teste.",
      variant: "default",
    })
  }

  const showErrorToast = () => {
    toast({
      title: "Erro na operação",
      description: "Esta é uma notificação de erro de teste.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Teste de Notificações</h1>
      <div className="flex gap-4">
        <Button onClick={showSuccessToast}>Mostrar Notificação de Sucesso</Button>
        <Button variant="destructive" onClick={showErrorToast}>
          Mostrar Notificação de Erro
        </Button>
      </div>
    </div>
  )
}
