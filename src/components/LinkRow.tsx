'use client'

import { useState } from 'react'
import { Copy, Trash2, BarChart2, ExternalLink, Lock } from 'lucide-react'
import type { Link } from '@/types/index'
import { shortUrl, copyToClipboard, formatDate, isExpired, cn } from '@/lib/utils'
import NextLink from 'next/link'
import { QrCodeModal } from '@/components/QrCodeModal'

interface LinkRowProps {
  link: Link
  maxClicks: number
  onDelete: (code: string) => void
}

export function LinkRow({ link, maxClicks, onDelete }: LinkRowProps) {
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const expired = isExpired(link.expiresAt)
  const short = shortUrl(link.code)
  const barWidth = maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0

  async function handleCopy() {
    await copyToClipboard(short)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    onDelete(link.code)
  }

  return (
    <div className={cn('group relative px-4 py-3.5 hover:bg-surface/60 transition-colors', expired && 'opacity-50')}>
      {/* Barra proporcional de cliques */}
      <div
        className='absolute bottom-0 left-0 h-[2px] bg-accent/15 transition-all duration-500'
        style={{ width: `${barWidth}%` }}
      />

      <div className='flex items-center gap-3'>
        {/* Code + URL */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-ink font-mono'>{link.code}</span>
            {link.custom && (
              <span className='text-[10px] tracking-widest uppercase text-accent bg-accent/8 px-1.5 py-0.5 rounded'>
                custom
              </span>
            )}
            {link.protected && <Lock size={11} className='text-muted' />}
            {expired && (
              <span className='text-[10px] tracking-widest uppercase text-red-400 bg-red-50 px-1.5 py-0.5 rounded'>
                expired
              </span>
            )}
          </div>
          <p className='text-xs text-muted truncate mt-0.5 max-w-sm'>{link.url}</p>
        </div>

        {/* Cliques */}
        <div className='hidden sm:block text-right w-16 shrink-0'>
          <p className='text-sm font-semibold tabular-nums text-ink'>{link.clicks.toLocaleString()}</p>
          <p className='label' style={{ fontSize: 10 }}>clicks</p>
        </div>

        {/* Data */}
        <div className='hidden lg:block text-right w-24 shrink-0'>
          <p className='text-xs text-muted'>{formatDate(link.createdAt)}</p>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
          <button onClick={handleCopy} title='Copiar'
            className='p-1.5 rounded text-muted hover:text-ink hover:bg-border transition-colors'>
            <Copy size={13} />
          </button>
          <a href={short} target='_blank' rel='noopener noreferrer'
            className='p-1.5 rounded text-muted hover:text-ink hover:bg-border transition-colors'>
            <ExternalLink size={13} />
          </a>
          <NextLink href={`/dashboard/stats/${link.code}`}
            className='p-1.5 rounded text-muted hover:text-ink hover:bg-border transition-colors'>
            <BarChart2 size={13} />
          </NextLink>
          <QrCodeModal code={link.code} />
          <button
            onClick={handleDelete}
            title={confirming ? 'Clique novamente para confirmar' : 'Deletar'}
            className={cn(
              'p-1.5 rounded transition-colors',
              confirming
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-muted hover:text-red-500 hover:bg-red-50'
            )}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {copied && (
          <span className='absolute right-4 text-xs text-accent font-medium'>Copiado!</span>
        )}
      </div>
    </div>
  )
}