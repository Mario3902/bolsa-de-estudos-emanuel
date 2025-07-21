import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id

    // Buscar candidatura
    const applicationQuery = "SELECT * FROM applications WHERE id = ?"
    const applications: any = await executeQuery(applicationQuery, [applicationId])

    if (applications.length === 0) {
      return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 })
    }

    // Buscar documentos da candidatura
    const documentsQuery = "SELECT * FROM application_documents WHERE application_id = ?"
    const documents = await executeQuery(documentsQuery, [applicationId])

    return NextResponse.json({
      application: applications[0],
      documents,
    })
  } catch (error) {
    console.error("Erro ao buscar candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id
    const { status, observacoes } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status é obrigatório" }, { status: 400 })
    }

    const validStatuses = ["pendente", "aprovado", "rejeitado", "em-analise"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    const updateQuery = "UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    await executeQuery(updateQuery, [status, applicationId])

    return NextResponse.json({ message: "Status atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id

    // Deletar documentos primeiro (devido à foreign key)
    await executeQuery("DELETE FROM application_documents WHERE application_id = ?", [applicationId])

    // Deletar candidatura
    const result: any = await executeQuery("DELETE FROM applications WHERE id = ?", [applicationId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Candidatura deletada com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
