"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building,
  Upload,
  Star,
  TrendingUp,
  Users,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function PagamentoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [comprovativo, setComprovativo] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const categoriaUrl = searchParams.get("categoria")

  const categories = {
    "startup-validada": {
      title: "Startups Validadas",
      price: "25.000 Kz",
      icon: <Star className="h-6 w-6" />,
      color: "bg-emerald-500",
    },
    "startup-faturamento": {
      title: "Startups com Faturamento",
      price: "50.000 Kz",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-green-500",
    },
    artista: {
      title: "Artistas",
      price: "75.000 Kz",
      icon: <Palette className="h-6 w-6" />,
      color: "bg-orange-500",
    },
    "empreendimento-sucesso": {
      title: "Empreendimentos de Sucesso",
      price: "100.000 Kz",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-500",
    },
  }

  const selectedCategory = categoriaUrl ? categories[categoriaUrl as keyof typeof categories] : null

  const paymentMethods = [
    {
      id: "multicaixa",
      name: "Multicaixa Express",
      description: "Pagamento via Multicaixa Express",
      icon: <CreditCard className="h-6 w-6" />,
      details: "Referência: 123 456 789",
    },
    {
      id: "transferencia",
      name: "Transferência Bancária",
      description: "Transferência para conta bancária",
      icon: <Building className="h-6 w-6" />,
      details: "IBAN: AO06 0000 0000 0000 0000 0000 0",
    },
    {
      id: "unitel-money",
      name: "Unitel Money",
      description: "Pagamento via Unitel Money",
      icon: <Smartphone className="h-6 w-6" />,
      details: "Número: +244 900 000 000",
    },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setComprovativo(file)
    }
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Por favor, selecione um método de pagamento.")
      return
    }

    if (!comprovativo) {
      alert("Por favor, faça o upload do comprovativo de pagamento.")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert("Pagamento processado com sucesso! Sua inscrição foi enviada para análise.")
      router.push("/")
    }, 3000)
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-white text-xl font-bold mb-4">Categoria não encontrada</h2>
            <p className="text-gray-300 mb-6">Por favor, volte e selecione uma categoria válida.</p>
            <Link href="/inscricao">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Voltar à Inscrição
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-white text-xl font-bold">Tubarões de Negócios</span>
            </Link>
            <Badge className="bg-green-500 text-white">Finalizar Pagamento</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Details */}
            <div className="space-y-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Resumo do Pedido</CardTitle>
                  <CardDescription className="text-gray-300">Confirme os detalhes da sua inscrição</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <div
                      className={`w-12 h-12 rounded-full ${selectedCategory.color} flex items-center justify-center text-white`}
                    >
                      {selectedCategory.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{selectedCategory.title}</h3>
                      <p className="text-gray-300 text-sm">Inscrição no programa</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{selectedCategory.price}</p>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">{selectedCategory.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Taxa de processamento:</span>
                    <span className="text-white">0 Kz</span>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-white">{selectedCategory.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Método de Pagamento</CardTitle>
                  <CardDescription className="text-gray-300">Escolha como deseja efetuar o pagamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} className="border-white/40" />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            {method.icon}
                          </div>
                          <div>
                            <Label htmlFor={method.id} className="text-white font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-gray-300 text-sm">{method.description}</p>
                            {selectedPaymentMethod === method.id && (
                              <p className="text-emerald-400 text-sm font-medium mt-1">{method.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-6">
              {selectedPaymentMethod && (
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Instruções de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPaymentMethod === "multicaixa" && (
                      <div className="space-y-3">
                        <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                          <h4 className="text-white font-medium mb-2">Multicaixa Express</h4>
                          <p className="text-gray-300 text-sm mb-3">
                            Use a referência abaixo para efetuar o pagamento:
                          </p>
                          <div className="bg-white/10 p-3 rounded font-mono text-white text-center text-lg">
                            123 456 789
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          <p>1. Acesse um terminal Multicaixa</p>
                          <p>2. Selecione "Pagamentos"</p>
                          <p>3. Digite a referência: 123 456 789</p>
                          <p>4. Confirme o valor: {selectedCategory.price}</p>
                          <p>5. Efetue o pagamento</p>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === "transferencia" && (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                          <h4 className="text-white font-medium mb-2">Transferência Bancária</h4>
                          <p className="text-gray-300 text-sm mb-3">Dados para transferência:</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Banco:</span>
                              <span className="text-white">Banco BAI</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">IBAN:</span>
                              <span className="text-white font-mono">AO06 0000 0000 0000 0000 0000 0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Titular:</span>
                              <span className="text-white">Tubarões de Negócios</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === "unitel-money" && (
                      <div className="space-y-3">
                        <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                          <h4 className="text-white font-medium mb-2">Unitel Money</h4>
                          <p className="text-gray-300 text-sm mb-3">Envie o pagamento para:</p>
                          <div className="bg-white/10 p-3 rounded font-mono text-white text-center text-lg">
                            +244 900 000 000
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          <p>1. Abra o app Unitel Money</p>
                          <p>2. Selecione "Enviar Dinheiro"</p>
                          <p>3. Digite o número: +244 900 000 000</p>
                          <p>4. Valor: {selectedCategory.price}</p>
                          <p>5. Confirme o envio</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Upload Comprovativo */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Comprovativo de Pagamento</CardTitle>
                  <CardDescription className="text-gray-300">
                    Faça o upload do comprovativo após efetuar o pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="comprovativo" className="text-white cursor-pointer">
                        Clique para selecionar o arquivo
                      </Label>
                      <Input
                        id="comprovativo"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-gray-400 text-sm">PNG, JPG ou PDF até 5MB</p>
                    </div>
                  </div>

                  {comprovativo && (
                    <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white text-sm">{comprovativo.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Link href="/inscricao" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
                <Button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || !comprovativo || isProcessing}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
                >
                  {isProcessing ? "Processando..." : "Finalizar Inscrição"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/30 border-t border-white/10 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-gray-300 text-sm">© 2025 Tubarões de Negócios. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/244900000000?text=Olá! Tenho dúvidas sobre o programa Tubarões de Negócios"
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
