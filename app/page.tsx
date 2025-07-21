import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, GraduationCap, CheckCircle, BookOpen, Award, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const eligibilityCategories = [
    {
      id: 1,
      title: "Recém-Formados do Ensino Médio",
      description: "Para quem terminou o ensino médio e quer ingressar na universidade",
      requirements: "Média ≥ 18 valores • Certificado de conclusão",
      icon: <GraduationCap className="h-8 w-8" />,
      color: "bg-emerald-500",
    },
    {
      id: 2,
      title: "Universitários em Curso",
      description: "Para estudantes já matriculados no ensino superior",
      requirements: "Média ≥ 18 valores • Declaração de matrícula",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-teal-500",
    },
    {
      id: 3,
      title: "Cursos Técnicos Superiores",
      description: "Para cursos técnicos e profissionalizantes",
      requirements: "Média ≥ 18 valores • Comprovativo de inscrição",
      icon: <Target className="h-8 w-8" />,
      color: "bg-cyan-500",
    },
    {
      id: 4,
      title: "Pós-Graduação e Mestrado",
      description: "Para estudantes de pós-graduação e mestrado",
      requirements: "Licenciatura concluída • Média ≥ 18 valores",
      icon: <Award className="h-8 w-8" />,
      color: "bg-green-500",
    },
  ]

  const benefits = ["Bolsa de estudos 100% gratuita", "Cobertura total das propinas universitárias até 60 mil kz"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white text-xl font-bold">Programa Bolsa de estudos Emanuel Xirimbimbi</span>
            </div>
            <Link href="/inscricao">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Candidatar-me Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Programa Bolsa de estudos
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {" "}
              Emanuel Xirimbimbi
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            "Educação é o combustível do sucesso" - Uma oportunidade única para jovens angolanos alcançarem seus sonhos
            académicos.
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Bolsa de estudos 100% gratuita para estudantes com média ≥ 18 valores.
          </p>
          <Link href="/inscricao">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-4"
            >
              CANDIDATAR-ME AGORA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Por que candidatar-se?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-300">
                <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Critérios de Elegibilidade</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Verifique se você atende aos requisitos para concorrer à bolsa de estudos.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eligibilityCategories.map((category) => (
              <Link
                key={category.id}
                href={`/inscricao?categoria=${category.id === 1 ? "ensino-medio" : category.id === 2 ? "universitario" : category.id === 3 ? "tecnico" : "pos-graduacao"}`}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-105">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 text-white`}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-white text-lg">{category.title}</CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30"
                    >
                      {category.requirements}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Patron & Platform Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="font-bold text-white text-center mb-4 text-4xl">
            Patrocinador{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              da Iniciativa
            </span>
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Conheça o visionário por trás desta oportunidade educacional transformadora.
          </p>

          {/* Emanuel Xirimbimbi Card */}
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image Side */}
                <div className="relative">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-10%20%C3%A0s%2008.48.04_3600c6b3.jpg-jYuwTD9ygMxyLfpgPnRkd2lLpWbLlF.jpeg"
                    alt="Emanuel Xirimbimbi"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <Badge className="bg-emerald-500 text-white mb-2">Patrocinador Principal</Badge>
                        <p className="text-white text-sm">Bolsa de Estudos 100% Gratuita</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Emanuel Xirimbimbi</h3>
                    <p className="text-emerald-400 text-lg font-medium">Patrocinador da Bolsa de Estudos</p>
                    <p className="text-gray-300">PhD, Hipnoterapeuta, Arquiteto, Mentor, Urbanista e Estrategista</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Mais de 20 anos de experiência em arquitetura, urbanismo e liderança executiva
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Doutorado em Design Urbano pela Beijing Forestry University (China)
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Membro da Ordem dos Arquitetos de Angola (AO-0601)
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Defensor da educação como ferramenta de transformação social
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Qualificações:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["PhD Design Urbano", "Arquitetura", "Hipnoterapia", "Mentoria", "Educação"].map(
                        (skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30"
                          >
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold text-white">100%</p>
                      <p className="text-gray-400 text-sm">Bolsa Gratuita</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold text-white">∞</p>
                      <p className="text-gray-400 text-sm">Oportunidades</p>
                    </div>
                  </div>
                  {/* Instagram Link */}
                  <div className="flex justify-center md:justify-start pt-4">
                    <a
                      href="https://www.instagram.com/emanuelxirimbimbi_oficial?utm_source=ig_web_button_share_sheet&igsh=MTM5dnV3bGd6MTViOQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-5 w-5"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="max-w-4xl mx-auto mt-12 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
              Sobre a{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Iniciativa
              </span>
            </h2>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  A Bolsa de Estudos Emanuel Xirimbimbi é uma iniciativa filantrópica que visa apoiar jovens angolanos
                  talentosos em sua jornada educacional, oferecendo oportunidades de ensino superior de qualidade.
                </p>

                <p className="text-gray-300 leading-relaxed">
                  Com o apoio logístico do Fly Squad, esta plataforma conecta estudantes meritosos a oportunidades
                  educacionais transformadoras, contribuindo para o desenvolvimento do capital humano em Angola.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="text-white font-semibold text-lg text-center">A iniciativa oferece:</h4>
              <div className="grid md:grid-cols-1 gap-4 max-w-md mx-auto">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Cobertura total das propinas universitárias</span>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30">
              <CardContent className="p-6">
                <p className="text-white font-medium text-center">
                  "Educação é o combustível do sucesso. Investir na educação dos jovens é investir no futuro de Angola."
                </p>
                <p className="text-gray-300 text-sm text-center mt-2">Emanuel Xirimbimbi</p>
              </CardContent>
            </Card>

            {/* Fly Squad Support */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-white text-xl font-bold">Apoio Logístico: Fly Squad</h3>
                    <p className="text-gray-300">
                      A Fly Squad oferece suporte técnico e logístico para garantir que esta iniciativa chegue aos
                      jovens que mais precisam, com eficiência e transparência.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-emerald-500 text-white">Gestão de Candidaturas</Badge>
                      <Badge className="bg-teal-500 text-white">Suporte Técnico</Badge>
                      <Badge className="bg-cyan-500 text-white">Acompanhamento</Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fly.jpg-d3A3Z6qnkiogUejF7vTjqCAkfMBXMo.jpeg"
                      alt="Fly Squad - Apoio Logístico"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para transformar seu futuro?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Não perca esta oportunidade única de receber uma bolsa de estudos 100% gratuita e realizar seus sonhos
            académicos.
          </p>
          <Link href="/inscricao">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-4"
            >
              CANDIDATAR-ME AGORA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/30 border-t border-white/10">
        <div className="container mx-auto text-center">
          <p className="text-gray-300 text-sm">
            © 2025 Programa Bolsa de estudos Emanuel Xirimbimbi. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/244900000000?text=Olá! Tenho dúvidas sobre o Programa Bolsa de estudos Emanuel Xirimbimbi"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
          </svg>
        </a>
      </div>
    </div>
  )
}
