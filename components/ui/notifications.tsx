"use client"

import { toast } from "@/components/ui/use-toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
}

// Duração padrão de 5 segundos
const DEFAULT_DURATION = 5000

export const showNotification = (type: NotificationType, message: string, options?: NotificationOptions) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  }

  const titles = {
    success: options?.title || "Sucesso",
    error: options?.title || "Erro",
    info: options?.title || "Informação",
    warning: options?.title || "Atenção",
  }

  const variants = {
    success: "default",
    error: "destructive",
    info: "default",
    warning: "default",
  }

  toast({
    title: titles[type],
    description: options?.description || message,
    variant: variants[type] as any,
    duration: options?.duration || DEFAULT_DURATION,
    // icon: icons[type],
  })
}

// Funções de conveniência
export const showSuccess = (message: string, options?: NotificationOptions) =>
  showNotification("success", message, options)

export const showError = (message: string, options?: NotificationOptions) => showNotification("error", message, options)

export const showInfo = (message: string, options?: NotificationOptions) => showNotification("info", message, options)

export const showWarning = (message: string, options?: NotificationOptions) =>
  showNotification("warning", message, options)

// Notificações específicas para operações CRUD
export const notifyCrudSuccess = {
  create: (entity = "Registro") => showSuccess(`${entity} criado com sucesso`),

  update: (entity = "Registro") => showSuccess(`${entity} atualizado com sucesso`),

  delete: (entity = "Registro") => showSuccess(`${entity} excluído com sucesso`),

  fetch: (entity = "Dados") => showSuccess(`${entity} carregados com sucesso`),
}

export const notifyCrudError = {
  create: (message = "Erro ao criar registro") => showError(message),

  update: (message = "Erro ao atualizar registro") => showError(message),

  delete: (message = "Erro ao excluir registro") => showError(message),

  fetch: (message = "Erro ao carregar dados") => showError(message),
}
