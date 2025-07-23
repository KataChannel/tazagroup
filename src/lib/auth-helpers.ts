import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './auth'

export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Try different cookie names for backward compatibility
    const token = request.cookies.get('auth-token')?.value || 
                  request.cookies.get('token')?.value
    
    if (!token) {
      return null
    }
    
    const decoded = await verifyToken(token)
    return decoded
  } catch (error) {
    return null
  }
}

export function getUserId(user: JWTPayload | null): string | null {
  return user?.userId || null
}
