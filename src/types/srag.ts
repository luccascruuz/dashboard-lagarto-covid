export type Classificacao =
  | 'influenza'
  | 'outro_virus'
  | 'outro_agente'
  | 'nao_especificado'
  | 'covid19'
  | 'em_investigacao'

export type Evolucao =
  | 'cura'
  | 'obito'
  | 'obito_outras_causas'
  | 'ignorado'
  | 'em_aberto'

export type FaixaEtaria =
  | 'menor_1'
  | '1_4'
  | '5_9'
  | '10_19'
  | '20_29'
  | '30_39'
  | '40_49'
  | '50_59'
  | '60_69'
  | '70_79'
  | '80_mais'

export type Agente =
  | 'covid19'
  | 'influenza_a'
  | 'influenza_b'
  | 'influenza_nao_tipado'
  | 'vsr'
  | 'rinovirus'
  | 'adenovirus'
  | 'metapneumovirus'
  | 'bocavirus'
  | 'parainfluenza_1'
  | 'parainfluenza_2'
  | 'parainfluenza_3'
  | 'parainfluenza_4'
  | 'outro'

export interface Envelope<T> {
  dados: T
  aviso?: string
}

export interface Resumo {
  totalCasos: number
  periodo: {
    primeiroInicioSintomas: string | null
    ultimoInicioSintomas: string | null
  }
  hospitalizados: number
  internadosUti: number
  obitosSrag: number
  obitosOutrasCausas: number
  casosEmAberto: number
  porClassificacao: Record<Classificacao, number>
  porEvolucao: Record<Evolucao, number>
  porSexo: Record<'masculino' | 'feminino' | 'ignorado', number>
  porFaixaEtaria: Record<FaixaEtaria | 'nao_informada', number>
  suporteVentilatorio: Record<
    'invasivo' | 'nao_invasivo' | 'nao' | 'ignorado' | 'nao_informado',
    number
  >
  agentesIdentificados: Record<Agente, number>
}

interface ComparacaoAnoAnterior {
  criterio: 'ano_inteiro' | 'mesmo_periodo'
  semanas: number
  casosAnoAnterior: number
  casosNestePeriodo: number
  variacaoPercentual: number | null
}

export interface ComparativoAno {
  ano: number
  parcial: boolean
  semanasNoPeriodo: number
  totalCasos: number
  mediaSemanal: number
  hospitalizados: number
  internadosUti: number
  obitosSrag: number
  casosEmAberto: number
  porClassificacao: Record<Classificacao, number>
  agentesIdentificados: Record<Agente, number>
  comparacaoAnoAnterior: ComparacaoAnoAnterior | null
}

export interface PontoSemanal {
  semana: number
  inicio: string
  fim: string
  casos: number
  obitosSrag: number
  internadosUti: number
  mediaMovel: number | null
}

export interface SerieSemanal {
  ano: number
  janelaMediaMovel: number
  semanas: PontoSemanal[]
}

interface FonteAno {
  ano: number
  arquivo: string
  url: string
  publicadoEm: string
  importadoEm: string
  linhasLidas: number
  totalCasos: number
  linhasDescartadas: number
}

export interface Fonte {
  municipio: { codigoIbge: string; nome: string; uf: string }
  origem: { sistema: string; conjuntoDeDados: string; descricao: string }
  anos: FonteAno[]
  sincronizacao: {
    emAndamento: boolean
    ultimoSucessoEm: string | null
    ultimaExecucao: {
      origem: string
      finalizadaEm: string | null
      sucesso: boolean
    } | null
  }
}

export interface Saude {
  status: 'ok' | 'degradado' | 'indisponivel'
  motivos: string[]
  dadosCarregados: boolean
  ultimoSucessoSincronizacao: string | null
}
