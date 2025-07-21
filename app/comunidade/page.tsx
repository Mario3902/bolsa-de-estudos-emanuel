"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, Search, GraduationCap, BookOpen, Award } from "lucide-react"
import Link from "next/link"

export default function ComunidadePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Histórias de sucesso de bolseiros
  const successStories = [
    {
      id: 1,
      nome: "Maria João Silva",
      curso: "Medicina",
      universidade: "Universidade Agostinho Neto",
      historia:
        "Graças à bolsa, consegui realizar meu sonho de ser médica e hoje trabalho no Hospital Central de Luanda.",
      imagem: "/placeholder.svg?height=300&width=400",
      ano: "2023",
      categoria: "Saúde",
      likes: 156,
      visualizacoes: 2340,
      destaque: true,
    },
    {
      id: 2,
      nome: "António Fernandes",
      curso: "Engenharia Informática",
      universidade: "Instituto Superior Politécnico",
      historia:
        "A bolsa mudou minha vida. Hoje sou desenvolvedor de software e contribuo para a transformação digital de Angola.",
      imagem: "/placeholder.svg?height=300&width=400",
      ano: "2022",
      categoria: "Tecnologia",
      likes: 203,
      visualizacoes: 3120,
      destaque: true,
    },
    {
      id: 3,
      nome: "Esperança Mateus",
      curso: "Direito",
      universidade: "Universidade Católica de Angola",
      historia: "Com o apoio da bolsa, formei-me em Direito e hoje defendo os direitos dos mais necessitados.",
      imagem: "/placeholder.svg?height=300&width=400",
      ano: "2023",
      categoria: "Direito",
      likes: 89,
      visualizacoes: 1560,
      destaque: false,
    },
    {
      id: 4,
      nome: "Carlos Mendes",
      curso: "Arquitectura",
      universidade: "Universidade Jean Piaget",
      historia:
        "A bolsa permitiu-me estudar arquitectura e hoje projeto edifícios sustentáveis para o futuro de Angola.",
      imagem: "/placeholder.svg?height=300&width=400",
      ano: "2022",
      categoria: "Arquitectura",
      likes: 134,
      visualizacoes: 2890,
      destaque: true,
    },
    {
      id: 5,
      nome: "Joana Baptista",
      curso: "Educação",
      universidade: "Instituto Superior de Ciências da Educação",
      historia: "Formei-me professora com a bolsa e hoje ensino a próxima geração de jovens angolanos.",
      imagem: "/placeholder.svg?height=300&width=400",
      ano: "2023",
      categoria: "Educação",
      likes: 167,
      visualizacoes: 2650,
      destaque: true,
    },
    {
      id: 6,
      nome: "Miguel Santos",
      curso: "Economia",
      universidade: "Universidade Lusíada de Angola",
      historia:
        "A bolsa abriu portas para minha carreira em economia e hoje trabalho no desenvolvimento económico do país.",
      imagem: "/placeholder.svg?height=300&width=400",
      ano: "2022",
      categoria: "Economia",
      likes: 76,
      visualizacoes: 1230,
      destaque: false,
    },
  ]

  const filteredStories = successStories.filter((story) => {
    const matchesSearch =
      story.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.historia.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || story.categoria === categoryFilter

    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(successStories.map((s) => s.categoria))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white text-xl font-bold">Programa Bolsa de estudos Emanuel Xirimbimbi</span>
            </Link>
            <Link href="/inscricao">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Candidatar-me Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Histórias de{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Sucesso</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conheça os jovens que transformaram suas vidas através do Programa Bolsa de estudos Emanuel Xirimbimbi e
            hoje contribuem para o desenvolvimento de Angola.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">150+</h3>
              <p className="text-gray-300">Bolseiros Formados</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">25+</h3>
              <p className="text-gray-300">Áreas de Estudo</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">95%</h3>
              <p className="text-gray-300">Taxa de Sucesso</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar histórias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white min-w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Mostrando {filteredStories.length} de {successStories.length} histórias
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredStories.map((story) => (
            <Card
              key={story.id}
              className={`backdrop-blur-sm hover:scale-105 transition-all duration-300 ${
                story.destaque
                  ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <div className="relative">
                <img
                  src={story.imagem || "/placeholder.svg"}
                  alt={story.nome}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-emerald-500 text-white">{story.categoria}</Badge>
                {story.destaque && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
                    Destaque
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="text-white text-lg font-bold mb-1">{story.nome}</h3>
                  <p className="text-emerald-400 text-sm font-medium">{story.curso}</p>
                  <p className="text-gray-400 text-xs">
                    {story.universidade} • Formado em {story.ano}
                  </p>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{story.historia}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{story.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{story.visualizacoes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Nenhuma história encontrada com os filtros aplicados.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
              }}
              className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Quer ser a próxima história de sucesso?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Candidate-se à Bolsa de Estudos Emanuel Xirimbimbi e transforme seu futuro através da educação.
            </p>
            <Link href="/inscricao">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Candidatar-me Agora
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/30 border-t border-white/10 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-gray-300 text-sm">
            © 2025 Programa Bolsa de estudos Emanuel Xirimbimbi. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-xs mt-2">Apoio logístico: Fly Squad</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/244900000000?text=Olá! Tenho dúvidas sobre o Programa Bolsa de estudos Emanuel Xirimbimbi"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
          </svg>
        </a>
      </div>
    </div>
  )
}
