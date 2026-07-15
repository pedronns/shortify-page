'use client'

import { useState, useEffect } from 'react'
import api from '@/src/lib/api'
import {
  LogOut,
  Trash2,
  BarChart3,
  Lock,
  Calendar,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

const errorMessages: Record<string, string> = {
  INVALID_CREDENTIALS: 'Senha incorreta. Tente novamente.',
  EMAIL_TAKEN: 'E-mail já cadastrado.',
  INVALID_EMAIL: 'E-mail inválido.',
  PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 6 caracteres.',
}

import {} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const [links, setLinks] = useState<Link[]>([])
  const [loadingLinks, setLoadingLinks] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('shortify_token')
    if (savedToken) {
      setToken(savedToken)
      fetchUserLinks()
    }
  }, [])

  const fetchUserLinks = async () => {
    setLoadingLinks(true)
    try {
      const response = await api.get('/me/links')
      setLinks(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingLinks(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const endpoint = isRegister ? '/auth/register' : '/auth/login'
    try {
      const response = await api.post(endpoint, { email, password })
      const jwt = response.data.access_token
      localStorage.setItem('shortify_token', jwt)
      setToken(jwt)
      fetchUserLinks()
    } catch (err: any) {
      const message = err.response?.data?.message

      if (isRegister && password !== confirmPassword) {
        setError('As senhas não coincidem. Tente novamente.')
        return
      }

      if (Array.isArray(message)) {
        setError(message.map((m) => errorMessages[m] ?? m).join(' '))
      } else {
        setError(errorMessages[message] ?? message ?? 'Erro na autenticação.')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('shortify_token')
    setToken(null)
    setLinks([])
  }

  const handleDelete = async (code: string) => {
    if (!confirm('Deseja realmente deletar este link?')) return
    try {
      await api.delete(`/${code}`)
      setLinks(links.filter((link) => link.code !== code))
    } catch (err) {
      alert('Erro ao deletar link.')
    }
  }

  // 1. ESTADO: Não Autenticado (Renderiza Form de Login/Registro)
  if (!token) {
    return (
      <div className='max-w-md mx-auto w-full px-4 py-24 flex-1 flex flex-col justify-center'>
        <div className='flex justify-between items-center mb-8'>
          <Link
            href='/'
            className='text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1'
          >
            <ArrowLeft className='w-3 h-3' /> Home
          </Link>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/logo.png'
              alt='logo'
              loading='eager'
              width={32}
              height={32}
            />
            <span className='font-bold text-xl tracking-tight'>
              Shortify<span className='text-blue-600'>.</span>
            </span>
          </div>
        </div>
        <div className='bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm'>
          <h2 className='text-lg font-bold text-zinc-900 mb-1'>
            {isRegister ? 'Criar nova conta' : 'Acessar Dashboard'}
          </h2>
          <p className='text-xs text-zinc-500 mb-4'>
            {isRegister
              ? 'Cadastre-se para gerenciar seus links'
              : 'Entre para acompanhar cliques e estatísticas'}
          </p>

          <form
            onSubmit={handleAuth}
            className='space-y-3'
          >
            <div>
              <label className='block text-xs font-medium text-zinc-500 mb-1'>
                E-mail
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 text-sm  bg-zinc-50 text-gray-800 border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500'
              />
            </div>
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
            {isRegister && (
              <div>
                <label className='block text-xs font-medium text-zinc-500 mb-1'>
                  Confirme a senha
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={showConfirmPassword ? 'suasenha' : '••••••••'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full px-3.5 py-2 pr-10 text-sm bg-zinc-50 border text-gray-800 placeholder-gray-400 border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors'
            >
              {isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          {error && (
            <p className='mt-3 text-xs text-red-600'>
              {errorMessages[error] ?? error}
            </p>
          )}

          <div className='mt-4 flex items-center justify-center gap-1 text-xs'>
            <span className='text-zinc-500'>
              {isRegister ? 'Já tem conta?' : 'Não tem conta?'}
            </span>

            <button
              onClick={() => setIsRegister(!isRegister)}
              className='font-bold text-blue-500 hover:text-blue-900 transition-colors cursor-pointer'
            >
              {isRegister ? 'Entrar' : 'Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. ESTADO: Autenticado (Renderiza Lista de Links)
  return (
    <div className='max-w-4xl mx-auto w-full px-4 py-12 flex-1'>
      <div className='flex justify-between items-center mb-8 border-b border-zinc-200 pb-4'>
        <div>
          <h1 className='text-xl font-bold tracking-tight'>Seus Links</h1>

          <p className='text-xs text-zinc-500'>
            Gerenciamento e monitoramento de cliques
          </p>
        </div>

        <div className='flex justify-between items-center gap-1'>
          <Link
            href={'/'}
            className='flex items-center gap-1 text-xs text-gray-500 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-500 transition-all'
          >
            <ArrowLeft className='w-3.5 h-3.5' /> Home
          </Link>
          <button
            onClick={handleLogout}
            className='flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer'
          >
            <LogOut className='w-3.5 h-3.5' /> Sair
          </button>
        </div>
      </div>

      {loadingLinks ? (
        <p className='text-sm text-zinc-500'>Carregando seus links...</p>
      ) : links.length === 0 ? (
        <div className='text-center py-12 bg-white border border-zinc-200 rounded-xl'>
          <p className='text-sm text-zinc-500'>
            Você ainda não criou nenhum link autenticado.
          </p>
        </div>
      ) : (
        <div className='grid gap-3'>
          {links.map((link) => (
            <div
              key={link.id}
              className='bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-zinc-300 transition-colors'
            >
              <div className='space-y-1 min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-sm text-blue-500'>
                    /{link.code}
                  </span>
                  {link.protected && (
                    <div title='Protegido por senha'>
                      <Lock className='w-3 h-3 text-amber-500' />
                    </div>
                  )}
                  {link.expiresAt && (
                    <div
                      title={
                        new Date(link.expiresAt) < new Date()
                          ? `Expirou em: ${new Date(link.expiresAt).toLocaleString('pt-BR')}`
                          : `Expira em: ${new Date(link.expiresAt).toLocaleString('pt-BR')}`
                      }
                    >
                      <Calendar
                        className={`w-3 h-3 ${
                          new Date(link.expiresAt) < new Date()
                            ? 'text-red-500'
                            : 'text-blue-500'
                        }`}
                      />
                    </div>
                  )}
                </div>
                <p className='text-xs text-zinc-400 truncate max-w-md'>
                  {link.url}
                </p>
              </div>

              <div className='flex items-center gap-4 flex-shrink-0 justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0 border-zinc-100'>
                <div className='flex items-center gap-1 text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md text-xs font-medium'>
                  <BarChart3 className='w-3.5 h-3.5 text-zinc-400' />
                  <span>
                    {link.clicks} {link.clicks > 1 ? 'cliques' : 'clique'}
                    </span>
                </div>

                <div className='flex items-center gap-1'>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/${link.code}`}
                    target='_blank'
                    rel='noreferrer'
                    className='p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500 transition-colors'
                  >
                    <ExternalLink className='w-4 h-4' />
                  </a>
                  <button
                    onClick={() => handleDelete(link.code)}
                    className='p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-md transition-colors'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
