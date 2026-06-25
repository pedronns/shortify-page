'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { Modal } from './ui/Modal'
import { shortUrl } from '../lib/utils'
import QrCodePreview from './QrCodePreview'
import ConfigQrCode from './ConfigQrCode'

interface QrCodeModalProps {
  code?: string
  url?: string
  initialPrimaryColor?: string
  initialBackgroundColor?: string
}

export function QrCodeModal({
  code,
  url,
  initialPrimaryColor = '#155dfc',
  initialBackgroundColor = '#ffffff',
}: QrCodeModalProps) {
  const [open, setOpen] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor)
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor)

  const urlToUse = url ?? (code ? shortUrl(code) : '')

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='p-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-colors text-zinc-600'
        title='QR Code'
      >
        <QrCode className='w-4 h-4' />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title='QR Code'>
        <div className='space-y-5'>
          <QrCodePreview
            url={urlToUse}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
          />
          {<ConfigQrCode
            enabled={true}
            setEnabled={() => {}}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />}
        </div>
      </Modal>
    </>
  )
}