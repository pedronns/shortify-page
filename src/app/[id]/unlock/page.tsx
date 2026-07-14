'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { isAxiosError } from 'axios'
import api from '@/src/lib/api'

const errorMessages: Record<string, string> = {
  INVALID_PASSWORD: 'Senha incorreta. Tente novamente.',
  PASSWORD_REQUIRED: 'Informe a senha para acessar este link.',
  NOT_PROTECTED: 'Este link não está protegido por senha.',
  NOT_FOUND: 'Este link não foi encontrado.',
  LINK_EXPIRED: 'Este link expirou.',
}

export default function UnlockPage() {
  const params = useParams<{ id?: string }>()
  const code = params?.id ?? ''
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null)

  useEffect(() => {
    const checkLinkAccess = async () => {
      if (!code) return

      try {
        const response = await api.get(`/info/${encodeURIComponent(code)}`)
        const isProtected = response.data?.protected === true

        if (!isProtected) {
          const targetUrl = response.data?.url
          if (targetUrl) {
            window.location.assign(targetUrl)
          } else {
            setError('Não foi possível abrir este link no momento.')
          }
        }
      } catch {
        setError('Não foi possível verificar este link no momento.')
      }
    }

    checkLinkAccess()
  }, [code])

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code) {
      setError('Link inválido. Verifique a URL e tente novamente.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post(`/${encodeURIComponent(code)}/unlock`, {
        password,
      })

      const url = response.data?.url
      if (url) {
        setUnlockedUrl(url)
        window.location.assign(url)
      } else {
        setError('Não foi possível abrir este link no momento.')
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message
        setError(
          errorMessages[message] ?? message ?? 'Erro ao desbloquear o link.',
        )
      } else {
        setError('Erro ao desbloquear o link.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto w-full px-4 py-24 flex-1 flex flex-col justify-center'>
      <div className='flex justify-between items-center mb-8'>
        <div className='flex items-center gap-2'>
          <span className='font-bold text-xl tracking-tight'>
            Shortify<span className='text-blue-600'>.</span>
          </span>
        </div>
      </div>

      <div className='bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm'>
        <h2 className='text-lg font-bold text-zinc-900 mb-1'>Link protegido</h2>
        <p className='text-xs text-zinc-500 mb-4'>
          Insira a senha para acessar o link{' '}
          <span className='font-semibold text-zinc-700'>/{code}</span>
        </p>

        <form
          onSubmit={handleAccess}
          className='space-y-3'
        >
          <div>
            <label className='block text-xs font-medium text-zinc-500 mb-1'>
              Senha
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={showPassword ? 'suasenha' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3.5 py-2 pr-10 text-sm bg-zinc-50 border text-gray-800 placeholder-gray-400 border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer'
              >
                {showPassword ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors'
          >
            {loading ? 'Verificando...' : 'Acessar'}
          </button>
        </form>

        {error && <p className='mt-3 text-xs text-red-600'>{error}</p>}

        {unlockedUrl && (
          <div className='mt-3 text-xs text-blue-600'>
            Redirecionando para o link protegido...
          </div>
        )}
      </div>
    </div>
  )
}
