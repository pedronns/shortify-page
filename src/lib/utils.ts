export function shortUrl(code: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'
  return `${base}/${code}`
}