"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const investors = [
  {
    name: "Tomasz Dowbor",
    role: "PCA",
    company: "Grupo Boavida",
    description:
      "Tomasz Dowbor é um visionário Polaco, que vive em Angola há quase 30 Anos, também conhecido como o Magnata do imobiliário, é o PCA do Grupo Boa Vida, responsável pela maior urbanização de condomínios privados em Angola, com estratégia, sensibilidade e coragem construiu perto de 10 mil casas ao longo da sua carreira profissional. Filantropo e socialista é também reconhecido por transformar ideias ambiciosas em Projectos sustentáveis em benefício das comunidades, Com ousadia estratégica e compromisso inabalável, cria Projectos sustentáveis que geram impacto humano, econômico e social, sendo o responsável por empregar mais de 10 mil colaboradores.",
    image:
      "https://imgs.search.brave.com/hO-NRpwmV0iQtWocL-RbOSUuXp56zyaaA5O4X2qokLw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8w/LzAyL1RvbWFzel9E/b3dib3JfMjAyNF8o/Y3JvcHBlZCkuanBn",
    expertise: ["Construção civil", " Urbanismo sustentável", "Infraestrutura", "Inclusão Social"],
    investments: "629+ projectos",
    portfolio: "€85.4M investidos",
  },
  {
    name: "Eng. Carlos Mendes",
    role: "Investidor Angel",
    company: "Mendes Ventures",
    description:
      "Engenheiro e empreendedor com foco em soluções financeiras e desenvolvimento de negócios. Pioneiro em investimentos em fintech em Angola.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.56_16e3865d.jpg-thJNR2ntRGpt0ipOdxJzsBKivjZeWm.jpeg",
    expertise: ["Finanças", "Blockchain", "Inovação"],
    investments: "45+ projetos",
    portfolio: "€2.8M investidos",
  },
  {
    name: "Dr. Miguel Santos",
    role: "Diretor de Investimentos",
    company: "Santos Capital",
    description:
      "Especialista em mercados financeiros e desenvolvimento estratégico em África. Mentor de diversos empreendedores de sucesso no continente.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.56_7b9c00fb.jpg-LriKwa9wY9SfFAW9zQ8XN7fJRQnzH9.jpeg",
    expertise: ["Estratégia", "Mercados", "Expansão"],
    investments: "55+ empresas",
    portfolio: "€4.1M investidos",
  },
  {
    name: "João Silva",
    role: "Fundador",
    company: "Silva Tech",
    description:
      "Empreendedor jovem focado em startups de tecnologia e inovação. Especialista em identificar talentos emergentes e projetos disruptivos.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.57_1459c638.jpg-pAzWdYfU39CYt2rKyoiRig4vCyyVzT.jpeg",
    expertise: ["Startups", "Tecnologia", "Inovação"],
    investments: "35+ projetos",
    portfolio: "€1.9M investidos",
  },
  {
    name: "Dr. Paulo Costa",
    role: "CEO",
    company: "Costa Industries",
    description:
      "Líder empresarial com experiência em indústria e exportação para mercados globais. Especialista em escalabilidade e crescimento sustentável.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.56_3d75aaaf.jpg-yE15ujvOGMp3GZyaFf7rQzl4JMiOYJ.jpeg",
    expertise: ["Indústria", "Exportação", "Crescimento"],
    investments: "40+ empresas",
    portfolio: "€3.5M investidos",
  },
  {
    name: "Eng. Ricardo Pereira",
    role: "Diretor Executivo",
    company: "Banco Afro",
    description:
      "Especialista em serviços financeiros e desenvolvimento de produtos bancários. Focado em startups com forte componente financeira e inclusão.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.57_99787137.jpg-SmgrhByYHkbIjYKsWvcg9AZhJdhWH6.jpeg",
    expertise: ["Banking", "Fintech", "Inclusão"],
    investments: "30+ startups",
    portfolio: "€2.2M investidos",
  },
  {
    name: "Dr. André Rodrigues",
    role: "Investidor",
    company: "Rodrigues Group",
    description:
      "Empreendedor experiente com foco em negócios de impacto social e sustentabilidade. Defensor do empreendedorismo responsável em Angola.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.57_ebea806d.jpg-Eh9gPrwt0nRqHVW33RZMHrrrzGkaAw.jpeg",
    expertise: ["Impacto Social", "Sustentabilidade", "ESG"],
    investments: "25+ projetos",
    portfolio: "€1.7M investidos",
  },
  {
    name: "Mestre Domingos Cardoso",
    role: "Conselheiro Senior",
    company: "Cardoso Heritage",
    description:
      "Veterano dos negócios com mais de 40 anos de experiência. Especialista em cultura, arte e preservação do patrimônio angolano através do empreendedorismo.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagem%20WhatsApp%202025-07-03%20%C3%A0s%2013.52.58_bc75950f.jpg-h6egC2wh331y0arYV5ThxEX8IK8fWL.jpeg",
    expertise: ["Cultura", "Arte", "Patrimônio"],
    investments: "20+ projetos",
    portfolio: "€1.3M investidos",
  },
]

export default function InvestorsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % investors.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % investors.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + investors.length) % investors.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {investors.map((investor, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image Side */}
                <div className="relative">
                  <img
                    src={investor.image || "/placeholder.svg"}
                    alt={investor.name}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <Badge className="bg-blue-500 text-white mb-2">{investor.investments}</Badge>
                        <p className="text-white text-sm">{investor.portfolio}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{investor.name}</h3>
                    <p className="text-blue-400 text-lg font-medium">{investor.role}</p>
                    <p className="text-gray-300">{investor.company}</p>
                  </div>

                  <p className="text-gray-300 leading-relaxed text-sm">{investor.description}</p>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Áreas de Especialização:</h4>
                    <div className="flex flex-wrap gap-2">
                      {investor.expertise.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg tracking-normal">
                      <p className="text-2xl font-bold text-white">{investor.investments.split("+")[0]}+</p>
                      <p className="text-gray-400 text-sm">Investimentos</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="font-bold text-white text-base">{investor.portfolio.split("€")[1]}</p>
                      <p className="text-gray-400 text-sm">Portfolio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          size="sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          size="sm"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {investors.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-500 scale-125" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
        {investors.map((investor, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
              index === currentIndex ? "ring-2 ring-blue-500 scale-105" : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
          >
            <img src={investor.image || "/placeholder.svg"} alt={investor.name} className="w-full h-20 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-1 left-1 right-1">
              <p className="text-white text-xs font-medium truncate">{investor.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
