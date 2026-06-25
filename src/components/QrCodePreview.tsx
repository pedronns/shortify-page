'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { Download, Loader2 } from 'lucide-react'

type Props = {
  url: string
  primaryColor: string
  backgroundColor: string
}

export default function QrCodePreview({
  url,
  primaryColor,
  backgroundColor,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rendering, setRendering] = useState(false)

  const render = useCallback(async () => {
    if (!canvasRef.current || !url) return
    setRendering(true)
    try {
      await QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: primaryColor,
          light: backgroundColor,
        },
      })
    } finally {
      setRendering(false)
    }
  }, [url, primaryColor, backgroundColor])

  useEffect(() => {
    render()
  }, [render])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qrcode-${url.split('/').pop() ?? 'link'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='relative rounded-lg border border-zinc-200 p-3 bg-white'>
        {rendering && (
          <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-white/80'>
            <Loader2
              size={18}
              className='animate-spin text-zinc-400'
            />
          </div>
        )}
        <canvas ref={canvasRef} />
      </div>

      <button
        onClick={handleDownload}
        disabled={rendering}
        className='flex items-center gap-2 text-xs font-medium text-zinc-500
                   hover:text-zinc-800 transition-colors disabled:opacity-40'
      >
        <Download size={13} />
        Baixar PNG
      </button>
    </div>
  )
}
