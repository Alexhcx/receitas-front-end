"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showSuccess, showError, showInfo, showWarning } from "@/components/ui/notifications"
import { useState } from "react"

export function TestNotifications() {
  const [visible, setVisible] = useState(false)

  const handleTestSuccess = () => {
    showSuccess("Operação realizada com sucesso!")
  }

  const handleTestError = () => {
    showError("Ocorreu um erro ao realizar a operação.")
  }

  const handleTestInfo = () => {
    showInfo("Esta é uma mensagem informativa.")
  }

  const handleTestWarning = () => {
    showWarning("Atenção! Esta ação pode ter consequências.")
  }

  return (
    <>
      {visible && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Teste de Notificações</CardTitle>
            <CardDescription>Clique nos botões abaixo para testar os diferentes tipos de notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleTestSuccess} variant="default">
                Testar Sucesso
              </Button>
              <Button onClick={handleTestError} variant="destructive">
                Testar Erro
              </Button>
              <Button onClick={handleTestInfo} variant="secondary">
                Testar Informação
              </Button>
              <Button onClick={handleTestWarning} variant="outline">
                Testar Aviso
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4">
        <Button variant="outline" onClick={() => setVisible(!visible)}>
          {visible ? "Ocultar Testes" : "Mostrar Testes de Notificação"}
        </Button>
      </div>
    </>
  )
}
