"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChefHat, Book, Users, Tag, Apple, FileText, Store, TestTube, Home, User } from "lucide-react"

const routes = [
  {
    label: "Início",
    icon: Home, 
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Empregados",
    icon: Users, 
    href: "/empregados",
    color: "text-violet-500",
  },
  {
    label: "Cozinheiros",
    icon: ChefHat,
    href: "/cozinheiros",
    color: "text-pink-700",
  },
  {
    label: "Degustadores",
    icon: User, 
    href: "/degustadores",
    color: "text-orange-700",
  },
  {
    label: "Editores",
    icon: User, 
    href: "/editores",
    color: "text-emerald-500",
  },
  {
    label: "Categorias",
    icon: Tag, 
    href: "/categorias",
    color: "text-green-700",
  },
  {
    label: "Ingredientes",
    icon: Apple, 
    href: "/ingredientes",
    color: "text-red-700",
  },
  {
    label: "Restaurantes", // Depende de Cozinheiros
    icon: Store,
    href: "/restaurantes",
    color: "text-purple-700",
  },
  {
    label: "Receitas", // Central, depende de Cozinheiros, Categorias, Ingredientes
    icon: FileText, 
    href: "/receitas",
    color: "text-blue-700",
  },
  {
    label: "Testes", // Depende de Receitas e Degustadores
    icon: TestTube, 
    href: "/testes",
    color: "text-indigo-700",
  },
  {
    label: "Livros", // Depende de Editores e Receitas
    icon: Book, 
    href: "/livros",
    color: "text-yellow-700",
  },
];

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-screen bg-slate-50 border-r w-[240px] shadow-sm">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-8">
          <h1 className="text-xl font-bold">Receitas App</h1>
        </Link>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === route.href && "bg-slate-200/50")}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
