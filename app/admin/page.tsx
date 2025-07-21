"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Gift,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface Application {
  id: number
  nome_completo: string
  email: string
  telefone: string
  bilhete_identidade: string
  categoria: string
  media_final: number
  status: string
  data_candidatura: string
  situacao_academica: string
  nome_escola: string
  universidade?: string
  curso?: string
  carta_motivacao: string
  documents?: any
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false)
  const [winner, setWinner] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    aprovados: 0,
    pendentes: 0,
    rejeitados: 0,
    em_analise: 0,
  })

  const scholarshipCategories = {
    "ensino-medio": {
      title: "Recém-Formados do Ensino Médio",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "bg-emerald-500",
    },
    universitario: {
      title: "Universitários em Curso",
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-green-500",
    },
    tecnico: {
      title: "Cursos Técnicos Superiores",
      icon: <Target className="h-4 w-4" />,
      color: "bg-orange-500",
    },
    "pos-graduacao": {
      title: "Pós-Graduação e Mestrado",
      icon: <Award className="h-4 w-4" />,
      color: "bg-purple-500",
    },
  }

  // Carregar candidaturas
  const loadApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (categoryFilter !== "all") params.append("categoria", categoryFilter)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/applications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
        setFilteredApplications(data)

        // Calcular estatísticas
        const newStats = {
          total: data.length,
          aprovados: data.filter((app: Application) => app.status === "aprovado").length,
          pendentes: data.filter((app: Application) => app.status === "pendente").length,
          rejeitados: data.filter((app: Application) => app.status === "rejeitado").length,
          em_analise: data.filter((app: Application) => app.status === "em-analise").length,
        }
        setStats(newStats)
      }
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [statusFilter, categoryFilter, searchTerm])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="bg-green-500 text-white">Aprovado</Badge>
      case "rejeitado":
        return <Badge className="bg-red-500 text-white">Rejeitado</Badge>
      case "pendente":
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
      case "em-analise":
        return <Badge className="bg-blue-500 text-white">Em Análise</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>
    }
  }

  const getCategoryBadge = (categoryId: string) => {
    const category = scholarshipCategories[categoryId as keyof typeof scholarshipCategories]
    if (!category) return null

    return (
      <Badge className={`${category.color} text-white flex items-center gap-1`}>
        {category.icon}
        {category.title}
      </Badge>
    )
  }

  const handleViewApplication = async (application: Application) => {
    try {
      const response = await fetch(`/api/applications/${application.id}`)
      if (response.ok) {
        const fullApplication = await response.json()
        setSelectedApplication(fullApplication)
        setIsViewDialogOpen(true)
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes da candidatura:", error)
    }
  }

  const handleUpdateApplicationStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await loadApplications() // Recarregar dados
        if (selectedApplication && selectedApplication.id === id) {
          setSelectedApplication({ ...selectedApplication, status: newStatus })
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleDrawWinner = () => {
    const approvedApplicants = applications.filter((app) => app.status === "aprovado")

    if (approvedApplicants.length === 0) {
      setWinner(null)
      alert("Não há candidaturas aprovadas para sortear um vencedor.")
      return
    }

    const randomIndex = Math.floor(Math.random() * approvedApplicants.length)
    const selectedWinner = approvedApplicants[randomIndex]
    setWinner(selectedWinner)
    setIsWinnerDialogOpen(true)
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/applications/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `candidaturas_${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Erro ao exportar:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white text-xl font-bold">Programa Bolsa de estudos Emanuel Xirimbimbi - Admin</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500 text-white">Área Restrita</Badge>
              <Button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" })
                  window.location.href = "/admin/login"
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-300">Gerencie as candidaturas e acompanhe as estatísticas da bolsa de estudos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total de Candidaturas</p>
                  <p className="text-white text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Pendentes</p>
                  <p className="text-white text-2xl font-bold">{stats.pendentes}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Em Análise</p>
                  <p className="text-white text-2xl font-bold">{stats.em_analise}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Aprovadas</p>
                  <p className="text-white text-2xl font-bold">{stats.aprovados}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Rejeitadas</p>
                  <p className="text-white text-2xl font-bold">{stats.rejeitados}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="candidaturas" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="candidaturas" className="data-[state=active]:bg-emerald-500">
              Candidaturas
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="data-[state=active]:bg-emerald-500">
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidaturas">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Gestão de Candidaturas
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Visualize e gerencie todas as candidaturas recebidas
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      onClick={handleDrawWinner}
                      disabled={stats.aprovados === 0}
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Sortear Vencedor
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      onClick={handleExport}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="text-white text-sm">
                      Pesquisar
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Nome completo, email ou BI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status-filter" className="text-white text-sm">
                      Status
                    </Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em-analise">Em Análise</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category-filter" className="text-white text-sm">
                      Categoria
                    </Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="ensino-medio">Recém-Formados do Ensino Médio</SelectItem>
                        <SelectItem value="universitario">Universitários em Curso</SelectItem>
                        <SelectItem value="tecnico">Cursos Técnicos Superiores</SelectItem>
                        <SelectItem value="pos-graduacao">Pós-Graduação e Mestrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                    <span className="ml-2 text-white">Carregando candidaturas...</span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/20 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20 hover:bg-white/5">
                          <TableHead className="text-gray-300">Nome Completo</TableHead>
                          <TableHead className="text-gray-300">Categoria</TableHead>
                          <TableHead className="text-gray-300">Contacto</TableHead>
                          <TableHead className="text-gray-300">Média Final</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((application) => (
                          <TableRow key={application.id} className="border-white/20 hover:bg-white/5">
                            <TableCell className="text-white font-medium">{application.nome_completo}</TableCell>
                            <TableCell>{getCategoryBadge(application.categoria)}</TableCell>
                            <TableCell className="text-gray-300">
                              <div className="text-sm">
                                <div>{application.email}</div>
                                <div>{application.telefone}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-medium">
                              {application.media_final ? `${application.media_final} valores` : "N/A"}
                            </TableCell>
                            <TableCell>{getStatusBadge(application.status)}</TableCell>
                            <TableCell className="text-gray-300">
                              {new Date(application.data_candidatura).toLocaleDateString("pt-AO")}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                  onClick={() => handleViewApplication(application)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                  disabled={application.status === "em-analise"}
                                  onClick={() => handleUpdateApplicationStatus(application.id, "em-analise")}
                                >
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  disabled={application.status === "aprovado"}
                                  onClick={() => handleUpdateApplicationStatus(application.id, "aprovado")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  disabled={application.status === "rejeitado"}
                                  onClick={() => handleUpdateApplicationStatus(application.id, "rejeitado")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {filteredApplications.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Nenhuma candidatura encontrada</h3>
                        <p className="text-gray-300 mb-4">
                          {applications.length === 0
                            ? "Ainda não há candidaturas submetidas ao programa."
                            : "Nenhuma candidatura corresponde aos filtros aplicados."}
                        </p>
                        {applications.length === 0 && (
                          <p className="text-gray-400 text-sm">
                            As candidaturas aparecerão aqui assim que forem submetidas pelos candidatos.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Candidaturas por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">Nenhuma candidatura para exibir estatísticas.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(scholarshipCategories).map(([key, category]) => {
                        const count = applications.filter((i) => i.categoria === key).length
                        const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0

                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm">{category.title}</span>
                              <span className="text-gray-300 text-sm">
                                {count} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`${category.color} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Status das Candidaturas</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">Nenhuma candidatura para exibir estatísticas.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { status: "aprovado", label: "Aprovadas", color: "bg-green-500" },
                        { status: "pendente", label: "Pendentes", color: "bg-yellow-500" },
                        { status: "em-analise", label: "Em Análise", color: "bg-blue-500" },
                        { status: "rejeitado", label: "Rejeitadas", color: "bg-red-500" },
                      ].map(({ status, label, color }) => {
                        const count = applications.filter((i) => i.status === status).length
                        const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0

                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm">{label}</span>
                              <span className="text-gray-300 text-sm">
                                {count} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`${color} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Candidatura</DialogTitle>
            <DialogDescription className="text-gray-300">
              Informações completas da candidatura selecionada
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Dados Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-gray-300 text-sm">Nome Completo</Label>
                      <p className="text-white font-medium">{selectedApplication.nome_completo}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Bilhete de Identidade</Label>
                      <p className="text-white">{selectedApplication.bilhete_identidade}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Telefone</Label>
                      <p className="text-white">{selectedApplication.telefone}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">E-mail</Label>
                      <p className="text-white">{selectedApplication.email}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Informações Académicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-gray-300 text-sm">Situação Académica</Label>
                      <p className="text-white">
                        {selectedApplication.situacao_academica === "matriculado"
                          ? "Já matriculado no ensino superior"
                          : "Terminou o ensino médio, não matriculado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Escola (Ensino Médio)</Label>
                      <p className="text-white">{selectedApplication.nome_escola}</p>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Média Final do Ensino Médio</Label>
                      <p className="text-white">
                        {selectedApplication.media_final ? `${selectedApplication.media_final} valores` : "N/A"}
                      </p>
                    </div>
                    {selectedApplication.situacao_academica === "matriculado" && (
                      <>
                        <div>
                          <Label className="text-gray-300 text-sm">Universidade/Instituto</Label>
                          <p className="text-white">{selectedApplication.universidade}</p>
                        </div>
                        <div>
                          <Label className="text-gray-300 text-sm">Curso</Label>
                          <p className="text-white">{selectedApplication.curso}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <Label className="text-gray-300 text-sm">Categoria</Label>
                      <div className="mt-1">{getCategoryBadge(selectedApplication.categoria)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Carta de Motivação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{selectedApplication.carta_motivacao}</p>
                </CardContent>
              </Card>

              {selectedApplication.documents && Object.keys(selectedApplication.documents).length > 0 && (
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Documentos Enviados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedApplication.documents).map(([key, doc]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-white text-sm">
                              {key === "bilhete_identidade" && "Bilhete de Identidade"}
                              {key === "certificado_ensino" && "Certificado de Conclusão do Ensino Médio"}
                              {key === "declaracao_notas" && "Declaração de Notas do Ensino Médio"}
                              {key === "declaracao_matricula" && "Declaração de Matrícula do Ensino Superior"}
                              {key === "carta_recomendacao" && "Carta de Recomendação"}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => window.open(`/api/files/${doc.path}`, "_blank")}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Fechar
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={selectedApplication.status === "em-analise"}
                  onClick={() => {
                    handleUpdateApplicationStatus(selectedApplication.id, "em-analise")
                    setIsViewDialogOpen(false)
                  }}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Colocar em Análise
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={selectedApplication.status === "aprovado"}
                  onClick={() => {
                    handleUpdateApplicationStatus(selectedApplication.id, "aprovado")
                    setIsViewDialogOpen(false)
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={selectedApplication.status === "rejeitado"}
                  onClick={() => {
                    handleUpdateApplicationStatus(selectedApplication.id, "rejeitado")
                    setIsViewDialogOpen(false)
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Winner Dialog */}
      <Dialog open={isWinnerDialogOpen} onOpenChange={setIsWinnerDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-green-400">🎉 Vencedor Selecionado! 🎉</DialogTitle>
            <DialogDescription className="text-gray-300">
              Parabéns ao(à) sortudo(a) vencedor(a) da Bolsa de Estudos Emanuel Xirimbimbi!
            </DialogDescription>
          </DialogHeader>
          {winner ? (
            <div className="space-y-4 mt-6">
              <div className="text-5xl font-extrabold text-white animate-pulse">{winner.nome_completo}</div>
              <p className="text-lg text-gray-200">Categoria: {getCategoryBadge(winner.categoria)}</p>
              <p className="text-lg text-gray-200">
                Email: <span className="font-medium">{winner.email}</span>
              </p>
              <p className="text-lg text-gray-200">
                Telefone: <span className="font-medium">{winner.telefone}</span>
              </p>
              <p className="text-sm text-gray-400 mt-4">Entre em contato com o vencedor para os próximos passos.</p>
            </div>
          ) : (
            <div className="text-lg text-gray-300 mt-4">
              Nenhum vencedor foi selecionado. Certifique-se de que há candidaturas aprovadas.
            </div>
          )}
          <div className="flex justify-center pt-6">
            <Button
              onClick={() => setIsWinnerDialogOpen(false)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
