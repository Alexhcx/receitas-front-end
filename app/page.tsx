import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChefHat, Book, Users, Tag, Apple, FileText, Store, TestTube } from "lucide-react"

export default function Home() {
  const modules = [
    {
      title: "Empregados",
      description: "Gerenciar informações de empregados",
      icon: <Users className="h-8 w-8" />, 
      href: "/empregados",
    },
    {
      title: "Cozinheiros",
      description: "Gerenciar cozinheiros e suas especialidades",
      icon: <ChefHat className="h-8 w-8" />, 
      href: "/cozinheiros",
    },
    {
      title: "Degustadores",
      description: "Gerenciar degustadores",
      icon: <Users className="h-8 w-8" />, 
      href: "/degustadores",
    },
    {
      title: "Editores",
      description: "Gerenciar editores de livros",
      icon: <Users className="h-8 w-8" />, 
      href: "/editores",
    },
    {
      title: "Categorias",
      description: "Gerenciar categorias de receitas",
      icon: <Tag className="h-8 w-8" />,
      href: "/categorias",
    },
    {
      title: "Ingredientes",
      description: "Gerenciar ingredientes para receitas",
      icon: <Apple className="h-8 w-8" />, 
      href: "/ingredientes",
    },
    {
      title: "Restaurantes", 
      description: "Gerenciar restaurantes onde cozinheiros trabalharam",
      icon: <Store className="h-8 w-8" />, 
      href: "/restaurantes",
    },
    {
      title: "Receitas",
      description: "Gerenciar receitas culinárias",
      icon: <FileText className="h-8 w-8" />, 
      href: "/receitas",
    },
    {
      title: "Testes", 
      description: "Gerenciar testes de receitas",
      icon: <TestTube className="h-8 w-8" />, 
      href: "/testes",
    },
    {
      title: "Livros", 
      description: "Gerenciar livros de receitas",
      icon: <Book className="h-8 w-8" />, 
      href: "/livros",
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sistema de Gerenciamento de Receitas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">{module.icon}</div>
              <div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={module.href}>
                <Button className="w-full">Acessar</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
