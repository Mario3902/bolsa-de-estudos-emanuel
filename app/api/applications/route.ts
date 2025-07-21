import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { saveUploadedFile, validateFile } from "@/lib/fileUpload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extrair dados do formulário
    const applicationData = {
      nome_completo: formData.get("nomeCompleto") as string,
      data_nascimento: formData.get("dataNascimento") as string,
      bilhete_identidade: formData.get("bilheteIdentidade") as string,
      telefone: formData.get("telefone") as string,
      email: formData.get("email") as string,
      situacao_academica: formData.get("situacaoAcademica") as string,
      nome_escola: formData.get("nomeEscola") as string,
      media_final: Number.parseFloat(formData.get("mediaFinal") as string),
      universidade: (formData.get("universidade") as string) || null,
      curso: (formData.get("curso") as string) || null,
      ano: (formData.get("ano") as string) || null,
      carta_motivacao: formData.get("cartaMotivacao") as string,
      situacao_financeira: (formData.get("situacaoFinanceira") as string) || null,
      numero_dependentes: Number.parseInt(formData.get("numeroDependentes") as string) || 0,
      categoria: formData.get("categoria") as string,
    }

    // Validar dados obrigatórios
    const requiredFields = [
      "nome_completo",
      "data_nascimento",
      "bilhete_identidade",
      "telefone",
      "email",
      "situacao_academica",
      "nome_escola",
      "media_final",
      "carta_motivacao",
      "categoria",
    ]

    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 })
      }
    }

    // Inserir candidatura na base de dados
    const insertQuery = `
      INSERT INTO applications (
        nome_completo, data_nascimento, bilhete_identidade, telefone, email,
        situacao_academica, nome_escola, media_final, universidade, curso, ano,
        carta_motivacao, situacao_financeira, numero_dependentes, categoria
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result: any = await executeQuery(insertQuery, [
      applicationData.nome_completo,
      applicationData.data_nascimento,
      applicationData.bilhete_identidade,
      applicationData.telefone,
      applicationData.email,
      applicationData.situacao_academica,
      applicationData.nome_escola,
      applicationData.media_final,
      applicationData.universidade,
      applicationData.curso,
      applicationData.ano,
      applicationData.carta_motivacao,
      applicationData.situacao_financeira,
      applicationData.numero_dependentes,
      applicationData.categoria,
    ])

    const applicationId = result.insertId

    // Processar uploads de arquivos
    const fileFields = [
      "file_bilheteIdentidade",
      "file_certificadoEnsino",
      "file_declaracaoNotas",
      "file_declaracaoMatricula",
      "file_cartaRecomendacao",
    ]

    for (const fieldName of fileFields) {
      const file = formData.get(fieldName) as File
      if (file && file.size > 0) {
        const validation = validateFile(file)
        if (!validation.valid) {
          return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        const uploadedFile = await saveUploadedFile(file, "documents")

        // Salvar informações do arquivo na base de dados
        const documentType = fieldName.replace("file_", "")
        const documentQuery = `
          INSERT INTO application_documents (
            application_id, document_type, file_name, file_path, file_size, mime_type
          ) VALUES (?, ?, ?, ?, ?, ?)
        `

        await executeQuery(documentQuery, [
          applicationId,
          documentType,
          uploadedFile.originalName,
          uploadedFile.path,
          uploadedFile.size,
          uploadedFile.mimeType,
        ])
      }
    }

    return NextResponse.json({
      message: "Candidatura submetida com sucesso!",
      applicationId,
    })
  } catch (error) {
    console.error("Erro ao processar candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const categoria = searchParams.get("categoria")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = "SELECT * FROM applications WHERE 1=1"
    const params: any[] = []

    if (status) {
      query += " AND status = ?"
      params.push(status)
    }

    if (categoria) {
      query += " AND categoria = ?"
      params.push(categoria)
    }

    query += " ORDER BY data_candidatura DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const applications = await executeQuery(query, params)

    // Contar total de registros
    let countQuery = "SELECT COUNT(*) as total FROM applications WHERE 1=1"
    const countParams: any[] = []

    if (status) {
      countQuery += " AND status = ?"
      countParams.push(status)
    }

    if (categoria) {
      countQuery += " AND categoria = ?"
      countParams.push(categoria)
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
