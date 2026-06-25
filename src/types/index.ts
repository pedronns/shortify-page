export interface Link {
  id: string
  url: string
  code: string
  custom: boolean
  protected: boolean
  clicks: number
  expiresAt: string | null
  createdAt: string
  userId?: string | null
}

export interface LinkInfo {
  protected: boolean
  url: string | null
  clicks: number
  expiresAt: string | null
  createdAt: string
}

export interface LinkStats {
  code: string
  url: string
  clicks: number
  expiresAt: string | null
  createdAt: string
  clicksByDay: { date: string; clicks: number }[]
}

export interface AuthResponse {
  access_token: string
}

export interface User {
  id: string
  email: string
}