import { type NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename

    // Validar nome do arquivo para segurança
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Nome de arquivo inválido" }, { status: 400 })
    }

    // Caminho para o arquivo temporário
    const filepath = join(process.cwd(), "public", "documents", filename)

    // Verificar se o arquivo existe
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 })
    }

    try {
      // Ler informações do arquivo
      const fileStats = await stat(filepath)
      const fileBuffer = await readFile(filepath)
      
      // Definir headers apropriados baseado na extensão do arquivo
      const extension = filename.split(".").pop()?.toLowerCase()
      let contentType = "application/octet-stream"

      switch (extension) {
        case "pdf":
          contentType = "application/pdf"
          break
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg"
          break
        case "png":
          contentType = "image/png"
          break
        case "webp":
          contentType = "image/webp"
          break
        case "gif":
          contentType = "image/gif"
          break
        case "doc":
          contentType = "application/msword"
          break
        case "docx":
          contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          break
      }

      const response = new NextResponse(fileBuffer)
      
      // Definir headers de resposta
      response.headers.set("Content-Type", contentType)
      response.headers.set("Content-Length", fileStats.size.toString())
      response.headers.set("Content-Disposition", `inline; filename="${filename}"`)
      
      // Headers de cache para arquivos temporários (cache curto)
      response.headers.set("Cache-Control", "public, max-age=3600") // 1 hora
      response.headers.set("Last-Modified", fileStats.mtime.toUTCString())
      
      // Headers de segurança
      response.headers.set("X-Content-Type-Options", "nosniff")
      response.headers.set("X-Frame-Options", "DENY")

      return response
    } catch (fileError) {
      console.error("Erro ao ler arquivo:", fileError)
      return NextResponse.json({ error: "Erro ao acessar arquivo" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao servir arquivo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// Endpoint adicional para listar arquivos de uma candidatura específica
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json({ error: "ID da candidatura é obrigatório" }, { status: 400 })
    }

    const documentsDir = join(process.cwd(), "public", "documents")
    
    if (!existsSync(documentsDir)) {
      return NextResponse.json({ files: [] })
    }

    try {
      const { readdir } = await import("fs/promises")
      const files = await readdir(documentsDir)
      
      // Filtrar arquivos que pertencem a esta candidatura
      const applicationFiles = files.filter(file => 
        file.startsWith(`${applicationId}_`)
      )

      // Mapear arquivos com informações úteis
      const fileInfos = await Promise.all(
        applicationFiles.map(async (file) => {
          try {
            const filePath = join(documentsDir, file)
            const stats = await stat(filePath)
            
            // Extrair tipo de documento do nome do arquivo
            const parts = file.split('_')
            const documentType = parts.length > 2 ? parts[1] : 'unknown'
            
            return {
              filename: file,
              documentType: documentType.replace('file', ''),
              size: stats.size,
              uploadDate: stats.birthtime,
              url: `/api/documents/${file}`
            }
          } catch (err) {
            console.error(`Erro ao processar arquivo ${file}:`, err)
            return null
          }
        })
      )

      // Filtrar arquivos que falharam no processamento
      const validFiles = fileInfos.filter(file => file !== null)

      return NextResponse.json({
        applicationId,
        files: validFiles,
        totalFiles: validFiles.length
      })
    } catch (dirError) {
      console.error("Erro ao listar diretório:", dirError)
      return NextResponse.json({ files: [] })
    }
  } catch (error) {
    console.error("Erro ao listar arquivos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
