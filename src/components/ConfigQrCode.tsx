'use client'

type Props = {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void
}

export default function ConfigQrCode({
  enabled,
  primaryColor,
  setPrimaryColor,
  backgroundColor,
  setBackgroundColor,
}: Props) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      

      {enabled && (
        <>
          <div>
            <label className='block text-xs font-medium text-zinc-500 mb-1.5'>
              Cor principal
            </label>

            <input
              type='color'
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className='h-9 w-full cursor-pointer rounded-md border border-zinc-200'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-zinc-500 mb-1.5'>
              Cor de fundo
            </label>

            <input
              type='color'
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className='h-9 w-full cursor-pointer rounded-md border border-zinc-200'
            />
          </div>
        </>
      )}
    </div>
  )
}
