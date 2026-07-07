'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/src/lib/api'
import { Copy, Check, ArrowRight, Settings } from 'lucide-react'
import { QrCodeModal } from '../components/QrCodeModal'
import { Eye, EyeOff } from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [password, setPassword] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShortenedUrl('')

    const payload = {
      url,
      ...(password && { password }),
      ...(expiresAt && { expiresAt: new Date(expiresAt).toISOString() }),
    }

    try {
      let response
      if (customCode.trim()) {
        response = await api.post('/custom', { ...payload, code: customCode })
      } else {
        response = await api.post('/random', payload)
      }

      setShortenedUrl(
        `${process.env.NEXT_PUBLIC_API_URL}/${response.data.code}`,
      )
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Ocorreu um erro ao encurtar o link.',
      )
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className='max-w-xl mx-auto w-full px-4 pt-24 pb-12 flex-1 flex flex-col justify-center'>
      <div className='flex justify-between items-center mb-8'>
        <div className='flex items-center gap-2'>
          <Image
            src='/images/logo.png'
            alt='logo'
            width={32}
            height={32}
          />
          <span className='font-bold text-xl tracking-tight'>
            Shortify<span className='text-blue-600'>.</span>
          </span>
        </div>
        <Link
          href='/dashboard'
          className='text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1'
        >
          Dashboard <ArrowRight className='w-3 h-3' />
        </Link>
      </div>

      <div className='bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm'>
        <form
          onSubmit={handleShorten}
          className='space-y-4'
        >
          <div>
            <label className='block text-xs font-medium text-zinc-500 mb-1.5'>
              URL Original
            </label>
            <input
              type='url'
              required
              placeholder='https://exemplo.com/sua-pagina-longa'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className='w-full px-3.5 py-2 text-sm bg-zinc-50 border text-gray-800 placeholder-gray-400 border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
            />
          </div>

          <button
            type='button'
            onClick={() => setShowAdvanced(!showAdvanced)}
            className='text-xs text-zinc-500 hover:text-blue-600 flex items-center gap-1 transition-colors'
          >
            <Settings className='w-3.5 h-3.5' />
            {showAdvanced
              ? 'Ocultar opções avançadas'
              : 'Mostrar opções avançadas'}
          </button>

          {showAdvanced && (
            <div className='pt-2 border-t border-dashed border-zinc-100 space-y-4'>
              <div>
                <label className='block text-xs font-medium text-zinc-500 mb-1.5'>
                  Link Customizado (Opcional)
                </label>
                <div className='flex rounded-lg shadow-sm'>
                  <span className='inline-flex items-center px-3 rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-400 text-xs select-none'>
                    s.fy/
                  </span>
                  <input
                    type='text'
                    placeholder='meu-link'
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className='w-full px-3.5 py-2 text-sm bg-zinc-50 border text-gray-800 placeholder-gray-400 border-zinc-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs font-medium text-zinc-500 mb-1.5'>
                    Senha de Acesso (Opcional)
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
                <div>
                  <label className='block text-xs font-medium text-zinc-500 mb-1.5'>
                    Data de Expiração (Opcional)
                  </label>
                  <input
                    type='datetime-local'
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className='w-full px-3.5 py-2 text-sm text-gray-800 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-500'
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50'
          >
            {loading ? 'Encurtando...' : 'Encurtar Link'}
          </button>
        </form>

        {error && (
          <div className='mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100'>
            {error === 'CODE_TAKEN'
              ? 'Esse link customizado já está em uso.'
              : error}
          </div>
        )}

        {shortenedUrl && (
          <div className='mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl animate-fade-in'>
            <p className='text-xs font-medium text-blue-600 mb-0.5'>
              Seu link curto está pronto:
            </p>
            <a
              href={shortenedUrl}
              target='_blank'
              rel='noreferrer'
              className='text-sm font-semibold text-zinc-900 truncate block hover:underline mb-3'
            >
              {shortenedUrl}
            </a>
            <div className='flex items-center gap-2'>
              <button
                onClick={copyToClipboard}
                className='p-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-colors text-zinc-600'
                title='Copiar'
              >
                {copied ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <Copy className='w-4 h-4' />
                )}
              </button>

              <QrCodeModal url={shortenedUrl} />
            </div>
          </div>
        )}
      </div>

      
    </main>
  )
}
