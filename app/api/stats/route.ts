import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Estatísticas gerais
    const totalQuery = "SELECT COUNT(*) as total FROM applications"
    const pendentesQuery = "SELECT COUNT(*) as total FROM applications WHERE status = 'pendente'"
    const aprovadosQuery = "SELECT COUNT(*) as total FROM applications WHERE status = 'aprovado'"
    const rejeitadosQuery = "SELECT COUNT(*) as total FROM applications WHERE status = 'rejeitado'"

    const [totalResult, pendentesResult, aprovadosResult, rejeitadosResult]: any[] = await Promise.all([
      executeQuery(totalQuery),
      executeQuery(pendentesQuery),
      executeQuery(aprovadosQuery),
      executeQuery(rejeitadosQuery),
    ])

    // Estatísticas por categoria
    const categoriaQuery = `
      SELECT categoria, COUNT(*) as total 
      FROM applications 
      GROUP BY categoria
    `
    const categoriaStats = await executeQuery(categoriaQuery)

    // Candidaturas por mês (últimos 6 meses)
    const monthlyQuery = `
      SELECT 
        DATE_FORMAT(data_candidatura, '%Y-%m') as mes,
        COUNT(*) as total
      FROM applications 
      WHERE data_candidatura >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(data_candidatura, '%Y-%m')
      ORDER BY mes
    `
    const monthlyStats = await executeQuery(monthlyQuery)

    return NextResponse.json({
      totals: {
        total: totalResult[0].total,
        pendentes: pendentesResult[0].total,
        aprovados: aprovadosResult[0].total,
        rejeitados: rejeitadosResult[0].total,
      },
      byCategory: categoriaStats,
      monthly: monthlyStats,
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    // Retornar dados mock se houver erro na base de dados
    return NextResponse.json({
      totals: {
        total: 0,
        pendentes: 0,
        aprovados: 0,
        rejeitados: 0,
      },
      byCategory: [],
      monthly: [],
    })
  }
}
