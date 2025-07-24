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

    // Estatísticas por província (campo que existe na DB)
    const provinciaQuery = `
      SELECT provincia, COUNT(*) as total 
      FROM applications 
      WHERE provincia IS NOT NULL AND provincia != ''
      GROUP BY provincia
      ORDER BY total DESC
    `
    const provinciaStats = await executeQuery(provinciaQuery)

    // Estatísticas por género (campo que existe na DB)
    const generoQuery = `
      SELECT genero, COUNT(*) as total 
      FROM applications 
      WHERE genero IS NOT NULL AND genero != ''
      GROUP BY genero
    `
    const generoStats = await executeQuery(generoQuery)

    // Estatísticas por universidade (top 10)
    const universidadeQuery = `
      SELECT universidade, COUNT(*) as total 
      FROM applications 
      WHERE universidade IS NOT NULL AND universidade != ''
      GROUP BY universidade
      ORDER BY total DESC
      LIMIT 10
    `
    const universidadeStats = await executeQuery(universidadeQuery)

    // Candidaturas por mês (últimos 6 meses) - usando data_submissao
    const monthlyQuery = `
      SELECT 
        DATE_FORMAT(data_submissao, '%Y-%m') as mes,
        COUNT(*) as total
      FROM applications 
      WHERE data_submissao >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(data_submissao, '%Y-%m')
      ORDER BY mes
    `
    const monthlyStats = await executeQuery(monthlyQuery)

    // Estatísticas de média acadêmica
    const mediaQuery = `
      SELECT 
        AVG(media_atual) as media_geral,
        MIN(media_atual) as media_minima,
        MAX(media_atual) as media_maxima,
        COUNT(CASE WHEN media_atual >= 18 THEN 1 END) as acima_18,
        COUNT(CASE WHEN media_atual >= 16 AND media_atual < 18 THEN 1 END) as entre_16_18,
        COUNT(CASE WHEN media_atual < 16 THEN 1 END) as abaixo_16
      FROM applications 
      WHERE media_atual IS NOT NULL
    `
    const mediaStats = await executeQuery(mediaQuery)

    // Estatísticas de situação financeira
    const financeiraQuery = `
      SELECT 
        situacao_financeira, 
        COUNT(*) as total,
        AVG(renda_familiar) as renda_media
      FROM applications 
      WHERE situacao_financeira IS NOT NULL AND situacao_financeira != ''
      GROUP BY situacao_financeira
    `
    const financeiraStats = await executeQuery(financeiraQuery)

    return NextResponse.json({
      totals: {
        total: totalResult[0].total,
        pendentes: pendentesResult[0].total,
        aprovados: aprovadosResult[0].total,
        rejeitados: rejeitadosResult[0].total,
      },
      byProvincia: provinciaStats,
      byGenero: generoStats,
      byUniversidade: universidadeStats,
      monthly: monthlyStats,
      mediaAcademica: mediaStats[0] || {
        media_geral: 0,
        media_minima: 0,
        media_maxima: 0,
        acima_18: 0,
        entre_16_18: 0,
        abaixo_16: 0
      },
      situacaoFinanceira: financeiraStats,
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
      byProvincia: [],
      byGenero: [],
      byUniversidade: [],
      monthly: [],
      mediaAcademica: {
        media_geral: 0,
        media_minima: 0,
        media_maxima: 0,
        acima_18: 0,
        entre_16_18: 0,
        abaixo_16: 0
      },
      situacaoFinanceira: [],
    })
  }
}
