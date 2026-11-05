import { gerarCsv } from './csv'
import { formatDate, formatVariacao, fracao } from './format'

describe('datas', () => {
  it('formata datas da API sem deslocar o fuso horário', () => {
    expect(formatDate('2026-01-04')).toBe('04/01/2026')
  })
})

describe('formatVariacao', () => {
  it('mostra o sinal e usa uma casa decimal abaixo de 10%', () => {
    expect(formatVariacao(-19.8)).toBe('−20%')
    expect(formatVariacao(1.8)).toBe('+1,8%')
    expect(formatVariacao(0)).toBe('0,0%')
  })
})

describe('fracao', () => {
  it('não divide por zero', () => {
    expect(fracao(3, 0)).toBe(0)
  })
})

describe('gerarCsv', () => {
  it('separa por ponto e vírgula e escapa aspas', () => {
    expect(
      gerarCsv(
        ['a', 'b'],
        [
          [1, 'x;"y"'],
          [null, 2],
        ],
      ),
    ).toBe('a;b\r\n1;"x;""y"""\r\n;2')
  })
})
