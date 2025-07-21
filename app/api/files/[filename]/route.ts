import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    // Verificar autenticação para arquivos sensíveis
    const token = request.cookies.get("auth_token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const filename = params.filename
    const filepath = join(process.cwd(), "public", "documents", filename)

    try {
      const fileBuffer = await readFile(filepath)
      const response = new NextResponse(fileBuffer)

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
      }

      response.headers.set("Content-Type", contentType)
      response.headers.set("Content-Disposition", `inline; filename="${filename}"`)

      return response
    } catch (fileError) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 })
    }
  } catch (error) {
    console.error("Erro ao servir arquivo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
