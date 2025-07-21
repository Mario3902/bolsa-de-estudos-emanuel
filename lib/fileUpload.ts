import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export interface UploadedFile {
  filename: string
  originalName: string
  size: number
  mimeType: string
  path: string
}

export async function saveUploadedFile(file: File, directory = "uploads"): Promise<UploadedFile> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Criar diretório se não existir
  const uploadDir = join(process.cwd(), "public", directory)
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    // Diretório já existe
  }

  // Gerar nome único para o arquivo
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split(".").pop()
  const filename = `${timestamp}-${randomString}.${extension}`

  const filepath = join(uploadDir, filename)
  await writeFile(filepath, buffer)

  return {
    filename,
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
    path: `/${directory}/${filename}`,
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"]

  if (file.size > maxSize) {
    return { valid: false, error: "Arquivo muito grande. Máximo 5MB." }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Tipo de arquivo não permitido. Use PDF, JPG, PNG ou WebP." }
  }

  return { valid: true }
}
