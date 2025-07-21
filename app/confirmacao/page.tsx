import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function ConfirmacaoPage() {
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
              <span className="text-white text-xl font-bold">Programa Bolsa de estudos Emanuel Xirimbimbi</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Candidatura Submetida com{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Sucesso!
              </span>
            </h1>
          </div>

          {/* Confirmation Message */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Obrigado pela sua candidatura!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-lg">
                Sua candidatura ao Programa Bolsa de estudos Emanuel Xirimbimbi foi recebida e está sendo processada
                pela nossa equipa.
              </p>

              <div className="bg-emerald-500/20 p-4 rounded-lg border border-emerald-500/30">
                <h3 className="text-white font-semibold mb-2">Próximos Passos:</h3>
                <ul className="text-gray-300 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Análise da documentação (3-5 dias úteis)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Avaliação da carta de motivação</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Contacto para possível entrevista</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Resultado final em até 15 dias</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                <h3 className="text-white font-semibold mb-2">Importante:</h3>
                <p className="text-gray-300 text-sm">
                  Mantenha seu telefone e email atualizados. Nossa equipa entrará em contacto através dos dados
                  fornecidos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Dúvidas ou Questões?</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="h-5 w-5 text-emerald-400" />
                  <span>bolsa@emanuelxirimbimbi.ao</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span>+244 900 000 000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Voltar ao Início
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Esta é uma iniciativa de Emanuel Xirimbimbi com apoio logístico da Fly Squad
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/30 border-t border-white/10">
        <div className="container mx-auto text-center">
          <p className="text-gray-300 text-sm">
            © 2025 Programa Bolsa de estudos Emanuel Xirimbimbi. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-xs mt-2">Apoio logístico: Fly Squad</p>
        </div>
      </footer>
    </div>
  )
}
