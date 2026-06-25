'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl'>
        <div className='mb-5 flex items-center justify-between'>
          {title ? (
            <h2 className='text-sm font-semibold text-zinc-900'>{title}</h2>
          ) : null}
          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition'
            aria-label='Fechar'
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
