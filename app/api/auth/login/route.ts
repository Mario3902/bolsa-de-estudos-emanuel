import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Hash da password "admin123" - $2b$10$rOzJqKqQxQxQxQxQxQxOeKqKqQxQxQxQxQxQxQxQxQxQxQxQxQx
const ADMIN_PASSWORD_HASH = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // admin123

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username e password são obrigatórios" }, { status: 400 })
    }

    // Verificar credenciais (fallback sem base de dados)
    if (username === "admin") {
      const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)

      if (isValidPassword) {
        const response = NextResponse.json({
          message: "Login realizado com sucesso",
          user: { id: 1, username: "admin" },
        })

        // Definir cookie com token simples
        response.cookies.set("auth_token", "authenticated-admin-token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60, // 24 horas
          path: "/",
        })

        return response
      }
    }

    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
