'use client'

import { useState, useEffect } from 'react'
import api from '@/src/lib/api'
import type { Link } from '@/types/index'
import {
  LogOut,
  Trash2,
  BarChart3,
  Lock,
  Calendar,
  ExternalLink,
} from 'lucide-react'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      setError(err.response?.data?.message || 'Erro na autenticação.')
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
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 text-sm bg-zinc-50 text-gray-800 border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors'
            >
              {isRegister ? 'Registrar' : 'Entrar'}
            </button>
          </form>

          {error && <p className='mt-3 text-xs text-red-600'>{error}</p>}

          <button
            onClick={() => setIsRegister(!isRegister)}
            className='w-full text-center text-xs text-zinc-500 hover:text-zinc-900 mt-4 transition-colors block'
          >
            {isRegister
              ? 'Já tem conta? Faça Login'
              : 'Não tem conta? Cadastre-se'}
          </button>
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
        <button
          onClick={handleLogout}
          className='flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all'
        >
          <LogOut className='w-3.5 h-3.5' /> Sair
        </button>
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
                  <span className='font-semibold text-sm text-zinc-900'>
                    /{link.code}
                  </span>
                  {link.protected && (
                    <Lock
                      className='w-3 h-3 text-amber-500'
                      title='Protegido por senha'
                    />
                  )}
                  {link.expiresAt && (
                    <Calendar
                      className='w-3 h-3 text-blue-500'
                      title={`Expira em: ${new Date(link.expiresAt).toLocaleDateString()}`}
                    />
                  )}
                </div>
                <p className='text-xs text-zinc-400 truncate max-w-md'>
                  {link.url}
                </p>
              </div>

              <div className='flex items-center gap-4 flex-shrink-0 justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0 border-zinc-100'>
                <div className='flex items-center gap-1 text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md text-xs font-medium'>
                  <BarChart3 className='w-3.5 h-3.5 text-zinc-400' />
                  <span>{link.clicks} cliques</span>
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
