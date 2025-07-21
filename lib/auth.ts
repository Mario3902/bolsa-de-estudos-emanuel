import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { executeQuery } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateUser(username: string, password: string) {
  const query = "SELECT id, username, password_hash FROM admin_users WHERE username = ?"
  const results: any = await executeQuery(query, [username])

  if (results.length === 0) {
    return null
  }

  const user = results[0]
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
  }
}
