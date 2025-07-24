import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extrair dados do formulário com nomes corretos para a DB
    const applicationData = {
      nome_completo: formData.get("nome_completo") as string,
      email: formData.get("email") as string,
      telefone: formData.get("telefone") as string,
      data_nascimento: formData.get("data_nascimento") as string,
      genero: formData.get("genero") as string,
      endereco: formData.get("endereco") as string,
      cidade: formData.get("cidade") as string,
      provincia: formData.get("provincia") as string,
      curso: formData.get("curso") as string,
      universidade: formData.get("universidade") as string,
      ano_academico: (formData.get("ano_academico") as string) || null,
      media_atual: Number.parseFloat(formData.get("media_atual") as string),
      situacao_financeira: (formData.get("situacao_financeira") as string) || null,
      renda_familiar: formData.get("renda_familiar") ? Number.parseFloat(formData.get("renda_familiar") as string) : null,
      motivacao: formData.get("motivacao") as string,
      objetivos: (formData.get("objetivos") as string) || null,
      experiencia_academica: (formData.get("experiencia_academica") as string) || null,
      atividades_extracurriculares: (formData.get("atividades_extracurriculares") as string) || null,
      referencias: (formData.get("referencias") as string) || null,
    }

    // Validar dados obrigatórios (campos NOT NULL na DB)
    const requiredFields = [
      "nome_completo",
      "email", 
      "telefone",
      "curso",
      "universidade",
    ]

    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 })
      }
    }

    // Validar email único
    const emailCheckQuery = "SELECT id FROM applications WHERE email = ?"
    const existingEmail = await executeQuery(emailCheckQuery, [applicationData.email])
    
    if (Array.isArray(existingEmail) && existingEmail.length > 0) {
      return NextResponse.json({ error: "Este email já está registrado" }, { status: 400 })
    }

    // Validar média (deve ser um número válido)
    if (isNaN(applicationData.media_atual)) {
      return NextResponse.json({ error: "Média atual deve ser um número válido" }, { status: 400 })
    }

    // Validar renda familiar (se fornecida, deve ser um número válido)
    if (applicationData.renda_familiar !== null && isNaN(applicationData.renda_familiar)) {
      return NextResponse.json({ error: "Renda familiar deve ser um número válido" }, { status: 400 })
    }

    // Inserir candidatura na base de dados
    const insertQuery = `
      INSERT INTO applications (
        nome_completo, email, telefone, data_nascimento, genero, endereco, cidade, provincia,
        curso, universidade, ano_academico, media_atual, situacao_financeira, renda_familiar,
        motivacao, objetivos, experiencia_academica, atividades_extracurriculares, referencias
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result: any = await executeQuery(insertQuery, [
      applicationData.nome_completo,
      applicationData.email,
      applicationData.telefone,
      applicationData.data_nascimento,
      applicationData.genero,
      applicationData.endereco,
      applicationData.cidade,
      applicationData.provincia,
      applicationData.curso,
      applicationData.universidade,
      applicationData.ano_academico,
      applicationData.media_atual,
      applicationData.situacao_financeira,
      applicationData.renda_familiar,
      applicationData.motivacao,
      applicationData.objetivos,
      applicationData.experiencia_academica,
      applicationData.atividades_extracurriculares,
      applicationData.referencias,
    ])

    const applicationId = result.insertId

    // ========== PROCESSAMENTO TEMPORÁRIO DE ARQUIVOS ==========
    const fileFields = [
      "file_bilheteIdentidade",
      "file_certificadoEnsino", 
      "file_declaracaoNotas",
      "file_declaracaoMatricula",
      "file_cartaRecomendacao",
    ]

    const uploadedFiles: string[] = []
    const documentsDir = join(process.cwd(), "public", "documents")

    // Criar diretório se não existir
    if (!existsSync(documentsDir)) {
      await mkdir(documentsDir, { recursive: true })
    }

    for (const fieldName of fileFields) {
      const file = formData.get(fieldName) as File
      if (file && file.size > 0) {
        try {
          // Validar arquivo
          const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
          if (!allowedTypes.includes(file.type)) {
            console.warn(`Tipo de arquivo não permitido: ${file.type} para ${fieldName}`)
            continue
          }

          // Validar tamanho (máximo 5MB)
          if (file.size > 5 * 1024 * 1024) {
            console.warn(`Arquivo muito grande: ${file.size} bytes para ${fieldName}`)
            continue
          }

          // Gerar nome único para o arquivo
          const timestamp = Date.now()
          const extension = file.name.split('.').pop() || 'bin'
          const uniqueFileName = `${applicationId}_${fieldName}_${timestamp}.${extension}`
          const filePath = join(documentsDir, uniqueFileName)

          // Salvar arquivo temporariamente
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filePath, buffer)

          uploadedFiles.push(uniqueFileName)
          console.log(`Arquivo salvo temporariamente: ${uniqueFileName}`)

        } catch (fileError) {
          console.error(`Erro ao processar arquivo ${fieldName}:`, fileError)
          // Continuar processamento mesmo se um arquivo falhar
        }
      }
    }

    return NextResponse.json({
      message: "Candidatura submetida com sucesso!",
      applicationId,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      note: uploadedFiles.length > 0 
        ? "Documentos foram recebidos e armazenados temporariamente." 
        : "Candidatura registrada sem documentos anexos."
    })
  } catch (error) {
    console.error("Erro ao processar candidatura:", error)
    
    // Tratar erros específicos do MySQL
    if (error instanceof Error) {
      if (error.message.includes("Duplicate entry")) {
        return NextResponse.json({ error: "Este email já está registrado" }, { status: 400 })
      }
      if (error.message.includes("Data truncated")) {
        return NextResponse.json({ error: "Dados inválidos fornecidos" }, { status: 400 })
      }
      if (error.message.includes("cannot be null")) {
        return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Validar parâmetros
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Parâmetros de paginação inválidos" }, { status: 400 })
    }

    let query = "SELECT * FROM applications WHERE 1=1"
    const params: any[] = []

    // Filtrar por status (se fornecido e válido)
    if (status && ["pendente", "aprovado", "rejeitado"].includes(status)) {
      query += " AND status = ?"
      params.push(status)
    }

    // Ordenar por data de submissão (mais recentes primeiro)
    query += " ORDER BY data_submissao DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const applications = await executeQuery(query, params)

    // Contar total de registros para paginação
    let countQuery = "SELECT COUNT(*) as total FROM applications WHERE 1=1"
    const countParams: any[] = []

    if (status && ["pendente", "aprovado", "rejeitado"].includes(status)) {
      countQuery += " AND status = ?"
      countParams.push(status)
    }

    const countResult: any = await executeQuery(countQuery, countParams)
    const total = countResult[0].total

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erro ao buscar candidaturas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("id")
    
    if (!applicationId) {
      return NextResponse.json({ error: "ID da candidatura é obrigatório" }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    // Validar status
    if (!status || !["pendente", "aprovado", "rejeitado"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    // Verificar se a candidatura existe
    const checkQuery = "SELECT id FROM applications WHERE id = ?"
    const existingApplication = await executeQuery(checkQuery, [applicationId])
    
    if (!Array.isArray(existingApplication) || existingApplication.length === 0) {
      return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 })
    }

    // Atualizar status da candidatura
    const updateQuery = "UPDATE applications SET status = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?"
    await executeQuery(updateQuery, [status, applicationId])

    return NextResponse.json({
      message: "Status da candidatura atualizado com sucesso!",
      applicationId,
      newStatus: status,
    })
  } catch (error) {
    console.error("Erro ao atualizar candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("id")
    
    if (!applicationId) {
      return NextResponse.json({ error: "ID da candidatura é obrigatório" }, { status: 400 })
    }

    // Verificar se a candidatura existe
    const checkQuery = "SELECT id FROM applications WHERE id = ?"
    const existingApplication = await executeQuery(checkQuery, [applicationId])
    
    if (!Array.isArray(existingApplication) || existingApplication.length === 0) {
      return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 })
    }

    // Deletar candidatura
    const deleteQuery = "DELETE FROM applications WHERE id = ?"
    await executeQuery(deleteQuery, [applicationId])

    return NextResponse.json({
      message: "Candidatura deletada com sucesso!",
      applicationId,
    })
  } catch (error) {
    console.error("Erro ao deletar candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

