"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function InscricaoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Campos existentes
    nomeCompleto: "",
    dataNascimento: "",
    bilheteIdentidade: "",
    telefone: "",
    email: "",
    situacaoAcademica: "",
    nomeEscola: "",
    mediaFinal: "",
    universidade: "",
    curso: "",
    ano: "",
    cartaMotivacao: "",
    situacaoFinanceira: "",
    numeroDependentes: "",
    
    // NOVOS CAMPOS OBRIGATÓRIOS PARA A DB
    genero: "",
    endereco: "",
    cidade: "",
    provincia: "",
    rendaFamiliar: "",
    objetivos: "",
    experienciaAcademica: "",
    atividadesExtracurriculares: "",
    referencias: "",
  })

  const categoriaUrl = searchParams.get("categoria")

  useEffect(() => {
    if (categoriaUrl) {
      setSelectedCategory(categoriaUrl)
    }
  }, [categoriaUrl])

  // MODIFICAÇÃO 1: Array 'categories' atualizado para remover a opção de mestrado.
  const categories = [
    {
      id: "ensino-medio",
      title: "Recém-Formados do Ensino Médio",
      description: "Para quem terminou o ensino médio e quer ingressar na universidade",
      requirements: "Média ≥ 16 valores • Certificado de conclusão",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "bg-emerald-500",
    },
    {
      id: "universitario",
      title: "Universitários em Curso",
      description: "Para estudantes já matriculados no ensino superior",
      requirements: "Média ≥ 16 valores • Declaração de notas",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      id: "tecnico",
      title: "Cursos Técnicos/Profissionas",
      description: "Para cursos técnicos e profissionalizantes",
      requirements: "Média ≥ 16 valores • Comprovativo de inscrição",
      icon: <Target className="h-6 w-6" />,
      color: "bg-orange-500",
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        alert("Por favor, envie apenas arquivos PDF, PNG ou JPG.")
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB.")
        return
      }

      setUploadedFiles((prev) => ({ ...prev, [field]: file }))
    }
  }

  const validateStep1 = () => {
    const requiredFields = [
      "nomeCompleto", 
      "dataNascimento", 
      "bilheteIdentidade", 
      "telefone", 
      "email",
      "genero",
      "endereco",
      "cidade",
      "provincia"
    ]
    return requiredFields.every((field) => formData[field as keyof typeof formData].trim() !== "")
  }

  // MODIFICAÇÃO 2 e 3: Validação do Passo 2 atualizada
  const validateStep2 = () => {
    // O campo 'curso' agora é sempre obrigatório
    const requiredFields = ["situacaoAcademica", "nomeEscola", "mediaFinal", "curso"]
    const isValid = requiredFields.every((field) => formData[field as keyof typeof formData].trim() !== "")

    // A média mínima agora é 16
    const media = Number.parseFloat(formData.mediaFinal)
    if (isNaN(media) || media < 16) {
      return false
    }

    // A validação de 'universidade' continua a aplicar-se apenas se matriculado
    if (formData.situacaoAcademica === "matriculado") {
      return isValid && formData.universidade.trim() !== ""
    }

    return isValid
  }

  const validateStep3 = () => {
    const requiredFields = [
      "cartaMotivacao",
      "rendaFamiliar",
      "objetivos",
      "experienciaAcademica",
      "atividadesExtracurriculares",
      "referencias"
    ]
    
    const isValid = requiredFields.every((field) => formData[field as keyof typeof formData].trim() !== "")
    const hasCategory = selectedCategory !== ""
    
    // Validar renda familiar como número
    const renda = Number.parseFloat(formData.rendaFamiliar)
    const isRendaValid = !isNaN(renda) && renda >= 0
    
    return isValid && hasCategory && isRendaValid
  }

  const validateStep4 = () => {
    const requiredFiles = ["bilheteIdentidade", "certificadoEnsino", "declaracaoNotas"]

    // Se matriculado, também precisa da declaração de matrícula
    if (formData.situacaoAcademica === "matriculado") {
      requiredFiles.push("declaracaoMatricula")
    }

    return requiredFiles.every((field) => uploadedFiles[field])
  }

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      alert("Por favor, preencha todos os campos obrigatórios antes de continuar.")
      return
    }

    if (step === 2 && !validateStep2()) {
      alert("Por favor, preencha todos os campos obrigatórios e verifique se a média é válida.")
      return
    }

    if (step === 3 && !validateStep3()) {
      alert("Por favor, preencha todos os campos obrigatórios, incluindo renda familiar e textos descritivos.")
      return
    }

    if (step === 4 && !validateStep4()) {
      alert("Por favor, faça o upload de todos os documentos obrigatórios.")
      return
    }

    if (step < 5) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const submitFormData = new FormData()

      // Mapear campos com nomes corretos para a DB
      const fieldMapping = {
        nomeCompleto: 'nome_completo',
        dataNascimento: 'data_nascimento',
        mediaFinal: 'media_atual',
        ano: 'ano_academico',
        cartaMotivacao: 'motivacao',
        situacaoFinanceira: 'situacao_financeira',
        rendaFamiliar: 'renda_familiar',
        experienciaAcademica: 'experiencia_academica',
        atividadesExtracurriculares: 'atividades_extracurriculares'
      }

      // Adicionar dados do formulário com nomes corretos
      Object.entries(formData).forEach(([key, value]) => {
        // Pular campos que a DB não espera
        if (['bilheteIdentidade', 'situacaoAcademica', 'nomeEscola', 'numeroDependentes'].includes(key)) {
          return
        }
        
        const dbFieldName = fieldMapping[key] || key
        submitFormData.append(dbFieldName, value)
      })

      // **** CORREÇÃO APLICADA AQUI ****
      // A lógica foi ajustada para enviar o campo 'universidade' apenas se o candidato estiver matriculado.
      // Caso contrário, o campo não é enviado, permitindo que a DB o trate como NULL ou default.
      if (formData.situacaoAcademica === 'matriculado') {
        submitFormData.append('universidade', formData.universidade);
      } else {
        // Para candidatos não matriculados, enviamos o nome da escola do ensino médio como 'universidade'
        // para manter um registo da instituição de origem, conforme a sua DB parece esperar.
        submitFormData.append('universidade', formData.nomeEscola);
      }
      submitFormData.append('curso', formData.curso);
      
      // Adicionar ficheiros (se o backend suportar)
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        submitFormData.append(`file_${key}`, file)
      })

      const response = await fetch("/api/applications", {
        method: "POST",
        body: submitFormData,
      })

      const result = await response.json()

      if (response.ok) {
        alert("Candidatura submetida com sucesso! Em breve será contactado pela nossa equipa.")
        router.push("/confirmacao")
      } else {
        alert(result.error || "Erro ao submeter candidatura. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao submeter candidatura:", error)
      alert("Erro ao submeter candidatura. Verifique sua conexão e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const getSelectedCategoryInfo = () => {
    return categories.find((cat) => cat.id === selectedCategory)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white text-xl font-bold">Programa Bolsa de estudos Emanuel Xirimbimbi</span>
            </Link>
            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm">Passo {step} de 5</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? "bg-emerald-500" : "bg-gray-600"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Dados Pessoais */}
          {step === 1 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Dados Pessoais</CardTitle>
                <CardDescription className="text-gray-300">Preencha seus dados pessoais básicos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto" className="text-white">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento" className="text-white">
                      Data de Nascimento *
                    </Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bilheteIdentidade" className="text-white">
                      Bilhete de Identidade *
                    </Label>
                    <Input
                      id="bilheteIdentidade"
                      value={formData.bilheteIdentidade}
                      onChange={(e) => handleInputChange("bilheteIdentidade", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="000000000LA000"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-white">
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="+244 900 000 000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="exemplo@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero" className="text-white">
                    Género *
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange("genero", value)}
                    value={formData.genero}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione o género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco" className="text-white">
                    Endereço *
                  </Label>
                  <Textarea
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Digite seu endereço completo"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-white">
                      Cidade *
                    </Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Nome da cidade"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provincia" className="text-white">
                      Província *
                    </Label>
                    <Select
                      onValueChange={(value) => handleInputChange("provincia", value)}
                      value={formData.provincia}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecione a província" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bengo">Bengo</SelectItem>
                        <SelectItem value="Benguela">Benguela</SelectItem>
                        <SelectItem value="Bié">Bié</SelectItem>
                        <SelectItem value="Cabinda">Cabinda</SelectItem>
                        <SelectItem value="Cuando Cubango">Cuando Cubango</SelectItem>
                        <SelectItem value="Cuanza Norte">Cuanza Norte</SelectItem>
                        <SelectItem value="Cuanza Sul">Cuanza Sul</SelectItem>
                        <SelectItem value="Cunene">Cunene</SelectItem>
                        <SelectItem value="Huambo">Huambo</SelectItem>
                        <SelectItem value="Huíla">Huíla</SelectItem>
                        <SelectItem value="Luanda">Luanda</SelectItem>
                        <SelectItem value="Lunda Norte">Lunda Norte</SelectItem>
                        <SelectItem value="Lunda Sul">Lunda Sul</SelectItem>
                        <SelectItem value="Malanje">Malanje</SelectItem>
                        <SelectItem value="Moxico">Moxico</SelectItem>
                        <SelectItem value="Namibe">Namibe</SelectItem>
                        <SelectItem value="Uíge">Uíge</SelectItem>
                        <SelectItem value="Zaire">Zaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Situação Académica */}
          {step === 2 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Situação Académica</CardTitle>
                <CardDescription className="text-gray-300">
                  Informações sobre sua formação e situação académica atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="situacaoAcademica" className="text-white">
                    Situação Académica Atual *
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange("situacaoAcademica", value)}
                    value={formData.situacaoAcademica}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione sua situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao-matriculado">Terminei o ensino médio, não estou matriculado</SelectItem>
                      <SelectItem value="matriculado">Já estou matriculado no ensino superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeEscola" className="text-white">
                      Nome da Escola (Ensino Médio) *
                    </Label>
                    <Input
                      id="nomeEscola"
                      value={formData.nomeEscola}
                      onChange={(e) => handleInputChange("nomeEscola", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Nome da escola onde terminou o ensino médio"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediaFinal" className="text-white">
                      Média Final do Ensino Médio *
                    </Label>
                    <Input
                      id="mediaFinal"
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={formData.mediaFinal}
                      onChange={(e) => handleInputChange("mediaFinal", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="16.0"
                      required
                    />
                    {/* MODIFICAÇÃO 2: Texto da nota mínima atualizado */}
                    <p className="text-gray-400 text-sm">Mínimo: 16 valores</p>
                  </div>
                </div>
                
                {/* MODIFICAÇÃO 3: Campo 'curso' movido para fora da condição e agora é sempre visível */}
                <div className="space-y-2">
                  <Label htmlFor="curso" className="text-white">
                    {formData.situacaoAcademica === 'matriculado' ? 'Curso que frequenta *' : 'Curso que pretende frequentar *'}
                  </Label>
                  <Input
                    id="curso"
                    value={formData.curso}
                    onChange={(e) => handleInputChange("curso", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Ex: Engenharia Informática"
                    required
                  />
                </div>

                {formData.situacaoAcademica === "matriculado" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="universidade" className="text-white">
                        Universidade/Instituto *
                      </Label>
                      <Input
                        id="universidade"
                        value={formData.universidade}
                        onChange={(e) => handleInputChange("universidade", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Nome da instituição"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ano" className="text-white">
                        Ano Académico
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("ano", value)} value={formData.ano}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecione o ano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1º Ano</SelectItem>
                          <SelectItem value="2">2º Ano</SelectItem>
                          <SelectItem value="3">3º Ano</SelectItem>
                          <SelectItem value="4">4º Ano</SelectItem>
                          <SelectItem value="5">5º Ano</SelectItem>
                          <SelectItem value="6">6º Ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Step 3: Categoria e Motivação */}
          {step === 3 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  {selectedCategory ? "Confirma a Categoria" : "Escolha a Categoria"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {selectedCategory
                    ? "Confirme a categoria selecionada e preencha as informações adicionais"
                    : "Selecione a categoria que melhor se adequa ao seu perfil"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                    >
                      <RadioGroupItem value={category.id} id={category.id} className="border-white/40" />
                      <div
                        className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-white flex-shrink-0`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={category.id} className="text-white font-medium cursor-pointer">
                          {category.title}
                        </Label>
                        <p className="text-gray-300 text-sm">{category.description}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                      >
                        {category.requirements}
                      </Badge>
                    </div>
                  ))}
                </RadioGroup>

                {selectedCategory && (
                  <div className="mt-6 p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Categoria selecionada:</span>
                      <Badge className="bg-emerald-500 text-white">{getSelectedCategoryInfo()?.title}</Badge>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cartaMotivacao" className="text-white">
                    Carta de Motivação *
                  </Label>
                  <Textarea
                    id="cartaMotivacao"
                    value={formData.cartaMotivacao}
                    onChange={(e) => handleInputChange("cartaMotivacao", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
                    placeholder="Descreva por que merece esta bolsa de estudos, seus objetivos académicos, situação financeira e como esta oportunidade impactará seu futuro..."
                    required
                  />
                  <p className="text-gray-400 text-sm">Mínimo: 200 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivos" className="text-white">
                    Objetivos Académicos e Profissionais *
                  </Label>
                  <Textarea
                    id="objetivos"
                    value={formData.objetivos}
                    onChange={(e) => handleInputChange("objetivos", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                    placeholder="Descreva seus objetivos académicos e profissionais a curto e longo prazo..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienciaAcademica" className="text-white">
                    Experiência Académica *
                  </Label>
                  <Textarea
                    id="experienciaAcademica"
                    value={formData.experienciaAcademica}
                    onChange={(e) => handleInputChange("experienciaAcademica", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                    placeholder="Descreva sua experiência académica, projetos, trabalhos de pesquisa, etc..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="atividadesExtracurriculares" className="text-white">
                    Atividades Extracurriculares *
                  </Label>
                  <Textarea
                    id="atividadesExtracurriculares"
                    value={formData.atividadesExtracurriculares}
                    onChange={(e) => handleInputChange("atividadesExtracurriculares", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                    placeholder="Descreva suas atividades extracurriculares, voluntariado, desportos, etc..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referencias" className="text-white">
                    Referências *
                  </Label>
                  <Textarea
                    id="referencias"
                    value={formData.referencias}
                    onChange={(e) => handleInputChange("referencias", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                    placeholder="Forneça referências de professores, empregadores ou líderes comunitários (nome, cargo, contacto)..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="situacaoFinanceira" className="text-white">
                      Situação Financeira (Opcional)
                    </Label>
                    <Select
                      onValueChange={(value) => handleInputChange("situacaoFinanceira", value)}
                      value={formData.situacaoFinanceira}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa renda</SelectItem>
                        <SelectItem value="media">Renda média</SelectItem>
                        <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rendaFamiliar" className="text-white">
                      Renda Familiar Mensal (Kz) *
                    </Label>
                    <Input
                      id="rendaFamiliar"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.rendaFamiliar}
                      onChange={(e) => handleInputChange("rendaFamiliar", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="50000.00"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Upload de Documentos */}
          {step === 4 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Documentos Obrigatórios</CardTitle>
                <CardDescription className="text-gray-300">
                  Faça o upload dos documentos necessários (PDF, PNG ou JPG - máximo 5MB cada)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bilhete de Identidade */}
                <div className="space-y-2">
                  <Label className="text-white">Cópia do Bilhete de Identidade *</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload("bilheteIdentidade", e)}
                      className="hidden"
                      id="bilheteIdentidade"
                    />
                    <label htmlFor="bilheteIdentidade" className="cursor-pointer">
                      {uploadedFiles.bilheteIdentidade ? (
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>{uploadedFiles.bilheteIdentidade.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-400">
                          <Upload className="h-8 w-8" />
                          <span>Clique para fazer upload</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Certificado de Ensino */}
                <div className="space-y-2">
                  <Label className="text-white">Certificado/Declaração de Conclusão do Ensino Médio *</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload("certificadoEnsino", e)}
                      className="hidden"
                      id="certificadoEnsino"
                    />
                    <label htmlFor="certificadoEnsino" className="cursor-pointer">
                      {uploadedFiles.certificadoEnsino ? (
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>{uploadedFiles.certificadoEnsino.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-400">
                          <Upload className="h-8 w-8" />
                          <span>Clique para fazer upload</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Declaração de Notas */}
                <div className="space-y-2">
                  <Label className="text-white">Declaração de Notas do Ensino Médio *</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload("declaracaoNotas", e)}
                      className="hidden"
                      id="declaracaoNotas"
                    />
                    <label htmlFor="declaracaoNotas" className="cursor-pointer">
                      {uploadedFiles.declaracaoNotas ? (
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>{uploadedFiles.declaracaoNotas.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-400">
                          <Upload className="h-8 w-8" />
                          <span>Clique para fazer upload</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Declaração de Matrícula (se aplicável) */}
                {formData.situacaoAcademica === "matriculado" && (
                  <div className="space-y-2">
                    <Label className="text-white">Declaração de Matrícula do Ensino Superior *</Label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload("declaracaoMatricula", e)}
                        className="hidden"
                        id="declaracaoMatricula"
                      />
                      <label htmlFor="declaracaoMatricula" className="cursor-pointer">
                        {uploadedFiles.declaracaoMatricula ? (
                          <div className="flex items-center justify-center space-x-2 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span>{uploadedFiles.declaracaoMatricula.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2 text-gray-400">
                            <Upload className="h-8 w-8" />
                            <span>Clique para fazer upload</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* Carta de Recomendação (Opcional) */}
                <div className="space-y-2">
                  <Label className="text-white">Carta de Recomendação (Opcional)</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload("cartaRecomendacao", e)}
                      className="hidden"
                      id="cartaRecomendacao"
                    />
                    <label htmlFor="cartaRecomendacao" className="cursor-pointer">
                      {uploadedFiles.cartaRecomendacao ? (
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>{uploadedFiles.cartaRecomendacao.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-400">
                          <Upload className="h-8 w-8" />
                          <span>Clique para fazer upload</span>
                        </div>
                      )}
                    </label>
                  </div>
                  <p className="text-gray-400 text-sm">De professor, líder comunitário ou empregador</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Revisão e Confirmação */}
          {step === 5 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Revisão da Candidatura</CardTitle>
                <CardDescription className="text-gray-300">
                  Revise todas as informações antes de submeter sua candidatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dados Pessoais */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Dados Pessoais</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                    <p><strong>Nome:</strong> {formData.nomeCompleto}</p>
                    <p><strong>Data de Nascimento:</strong> {formData.dataNascimento}</p>
                    <p><strong>BI:</strong> {formData.bilheteIdentidade}</p>
                    <p><strong>Telefone:</strong> {formData.telefone}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Género:</strong> {formData.genero}</p>
                    <p><strong>Endereço:</strong> {formData.endereco}</p>
                    <p><strong>Cidade:</strong> {formData.cidade}</p>
                    <p><strong>Província:</strong> {formData.provincia}</p>
                  </div>
                </div>

                {/* Situação Académica */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Situação Académica</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                    <p>
                      <strong>Situação:</strong>{" "}
                      {formData.situacaoAcademica === "matriculado" ? "Já matriculado" : "Não matriculado"}
                    </p>
                    <p>
                      <strong>Escola (Ensino Médio):</strong> {formData.nomeEscola}
                    </p>
                    <p>
                      <strong>Média Final:</strong> {formData.mediaFinal} valores
                    </p>
                    {formData.situacaoAcademica === "matriculado" && (
                      <>
                        <p>
                          <strong>Universidade:</strong> {formData.universidade}
                        </p>
                        <p>
                          <strong>Curso:</strong> {formData.curso}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Categoria */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Categoria</h3>
                  <Badge className="bg-emerald-500 text-white">{getSelectedCategoryInfo()?.title}</Badge>
                </div>

                {/* Informações Financeiras */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Informações Financeiras</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                    <p><strong>Situação Financeira:</strong> {formData.situacaoFinanceira}</p>
                    <p><strong>Renda Familiar:</strong> {formData.rendaFamiliar} Kz</p>
                  </div>
                </div>

                {/* Informações Académicas Adicionais */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Informações Académicas</h3>
                  <div className="space-y-2 text-gray-300">
                    <div>
                      <strong>Objetivos:</strong>
                      <div className="bg-white/5 p-2 rounded mt-1">
                        <p className="text-sm">{formData.objetivos}</p>
                      </div>
                    </div>
                    <div>
                      <strong>Experiência Académica:</strong>
                      <div className="bg-white/5 p-2 rounded mt-1">
                        <p className="text-sm">{formData.experienciaAcademica}</p>
                      </div>
                    </div>
                    <div>
                      <strong>Atividades Extracurriculares:</strong>
                      <div className="bg-white/5 p-2 rounded mt-1">
                        <p className="text-sm">{formData.atividadesExtracurriculares}</p>
                      </div>
                    </div>
                    <div>
                      <strong>Referências:</strong>
                      <div className="bg-white/5 p-2 rounded mt-1">
                        <p className="text-sm">{formData.referencias}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Documentos Enviados</h3>
                  <div className="space-y-2">
                    {Object.entries(uploadedFiles).map(([key, file]) => (
                      <div key={key} className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">
                          {key === "bilheteIdentidade" && "Bilhete de Identidade"}
                          {key === "certificadoEnsino" && "Certificado de Conclusão do Ensino Médio"}
                          {key === "declaracaoNotas" && "Declaração de Notas do Ensino Médio"}
                          {key === "declaracaoMatricula" && "Declaração de Matrícula do Ensino Superior"}
                          {key === "cartaRecomendacao" && "Carta de Recomendação"}: {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carta de Motivação */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg">Carta de Motivação</h3>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{formData.cartaMotivacao}</p>
                  </div>
                </div>

                {/* Termos e Condições */}
                <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <p className="text-white text-sm">
                    Ao submeter esta candidatura, declaro que todas as informações fornecidas são verdadeiras e concordo
                    com os termos e condições do Programa Bolsa de estudos Emanuel Xirimbimbi.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            ) : (
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
            )}

            <Button
              onClick={handleNextStep}
              disabled={
                (step === 1 && !validateStep1()) ||
                (step === 2 && !validateStep2()) ||
                (step === 3 && !validateStep3()) ||
                (step === 4 && !validateStep4()) ||
                isSubmitting
              }
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submetendo...
                </>
              ) : step === 5 ? (
                "Submeter Candidatura"
              ) : (
                "Próximo"
              )}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
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
          href="https://wa.me/244923440172?text=Olá! Tenho dúvidas sobre o Programa Bolsa de estudos Emanuel Xirimbimbi"
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
