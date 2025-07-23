import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "cloud.novaweb.ao",
  user: process.env.DB_USER || "bolsadae_admin",
  password: process.env.DB_PASSWORD || "&2K^Tnf{+=jyI)Cq",
  database: process.env.DB_NAME || "bolsadee_bolsa_estudos",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function executeQuery(query: string, params: any[] = []) {
  const conn = await getConnection()
  try {
    const [results] = await conn.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function closeConnection() {
  if (connection) {
    await connection.end()
    connection = null
  }
}
