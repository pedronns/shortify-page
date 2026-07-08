# Shortify

Shortify é uma aplicação Next.js para encurtar URLs rapidamente e gerar QR codes. O projeto inclui:

- Página de encurtamento de link com suporte a URL customizada
- Opções avançadas: código customizado, senha e data de expiração
- Dashboard de autenticação para gerenciar links do usuário
- QR code com configurações de cor e download em PNG

## Funcionalidades

- Encurtamento de URLs por rota aleatória ou código customizado
- Compartilhamento de links encurtados
- Copiar para clipboard
- QR code em modal com cores customizáveis
- Login / registro para visualizar e excluir links
- Integração com API via `NEXT_PUBLIC_API_URL`

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- lucide-react
- qrcode

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto e defina a URL da API:

```env
NEXT_PUBLIC_API_URL=https://sua-api.com
```

> A aplicação envia requisições para o backend usando `src/lib/api.ts`.

## Scripts úteis

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera a build de produção
- `npm run start` - executa a aplicação compilada
- `npm run lint` - executa o ESLint

## Estrutura do projeto

- `src/app/page.tsx` - página principal de encurtamento
- `src/app/dashboard/page.tsx` - dashboard de login e gerenciamento de links
- `src/lib/api.ts` - configuração do cliente Axios e token JWT
- `src/components/QrCodeModal.tsx` - modal de QR code
- `src/components/QrCodePreview.tsx` - preview e download do QR code
- `src/components/ConfigQrCode.tsx` - configurações de cor do QR code

## Como usar

1. Configure `NEXT_PUBLIC_API_URL` no `.env.local`
2. Execute `npm run dev`
3. Acesse `http://localhost:3000`
4. Insira a URL original e clique em `Encurtar Link`
5. Use as opções avançadas para adicionar código customizado, senha ou expiração

## Dashboard

- Acesse `http://localhost:3000/dashboard`
- Faça login ou registre uma nova conta
- Visualize seus links encurtados
- Exclua links diretamente do painel

## Observações

- O frontend espera um backend compatível com as rotas `/random`, `/custom`, `/auth/login`, `/auth/register`, `/me/links` e `DELETE /:code`
- O `shortenedUrl` gerado é montado usando `NEXT_PUBLIC_API_URL`
- O QR code é gerado no cliente com a biblioteca `qrcode`

## Licença

Este projeto é privado e foi criado para uso interno.
