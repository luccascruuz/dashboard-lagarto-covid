import { ApiError, fetcher, rotas } from './api'

describe('rotas', () => {
  it('monta os filtros de ano e a janela da média móvel', () => {
    expect(rotas.resumo()).toBe('/v1/srag/resumo')
    expect(rotas.resumo([2020, 2021])).toBe('/v1/srag/resumo?ano=2020,2021')
    expect(rotas.semanas(2026)).toBe('/v1/srag/semanas?ano=2026&janela=4')
  })
})

describe('fetcher', () => {
  const fetchOriginal = global.fetch

  afterEach(() => {
    global.fetch = fetchOriginal
  })

  it('devolve o corpo da resposta', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ dados: [1] }),
    })

    await expect(fetcher('/v1/srag/anos')).resolves.toEqual({ dados: [1] })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api-covid-lagarto-se.vercel.app/v1/srag/anos',
      expect.anything(),
    )
  })

  it('usa a mensagem de erro padronizada da API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: () =>
        Promise.resolve({
          erro: { codigo: 'DADOS_INDISPONIVEIS', mensagem: 'Ainda sem dados' },
        }),
    })

    const erro = await fetcher('/v1/srag/anos').catch((e) => e)

    expect(erro).toBeInstanceOf(ApiError)
    expect(erro).toMatchObject({
      message: 'Ainda sem dados',
      status: 503,
      codigo: 'DADOS_INDISPONIVEIS',
    })
  })
})
