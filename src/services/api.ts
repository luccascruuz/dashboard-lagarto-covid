import type { Saude } from '../types/srag'

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api-covid-lagarto-se.vercel.app'
).replace(/\/+$/, '')

export const JANELA_MEDIA_MOVEL = 4

export class ApiError extends Error {
  status: number
  codigo?: string

  constructor(mensagem: string, status: number, codigo?: string) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
    this.codigo = codigo
  }
}

export const rotas = {
  anos: '/v1/srag/anos',
  fonte: '/v1/fonte',
  saude: '/health',
  resumo: (anos?: number[]) =>
    anos && anos.length > 0
      ? `/v1/srag/resumo?ano=${anos.join(',')}`
      : '/v1/srag/resumo',
  semanas: (ano: number) =>
    `/v1/srag/semanas?ano=${ano}&janela=${JANELA_MEDIA_MOVEL}`,
}

export async function fetcher<T>(rota: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${rota}`, {
    headers: { Accept: 'application/json' },
  })
  const corpo = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    throw new ApiError(
      corpo?.erro?.mensagem ?? `A API respondeu com status ${resposta.status}`,
      resposta.status,
      corpo?.erro?.codigo,
    )
  }

  return corpo as T
}

export async function buscarSaude(): Promise<Saude> {
  const resposta = await fetch(`${API_URL}${rotas.saude}`, {
    headers: { Accept: 'application/json' },
  })
  const corpo = await resposta.json().catch(() => null)

  if (!corpo?.status) {
    throw new ApiError(
      `A API respondeu com status ${resposta.status}`,
      resposta.status,
    )
  }

  return corpo as Saude
}
