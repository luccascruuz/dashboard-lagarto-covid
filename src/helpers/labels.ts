import type {
  Agente,
  Classificacao,
  Evolucao,
  FaixaEtaria,
} from '../types/srag'

export function cor(token: string) {
  return `var(--chakra-colors-${token.replace(/\./g, '-')})`
}

export const CLASSIFICACOES: {
  chave: Classificacao
  rotulo: string
  cor: string
}[] = [
  { chave: 'covid19', rotulo: 'Covid-19', cor: cor('viz.1') },
  {
    chave: 'outro_virus',
    rotulo: 'Outros vírus respiratórios',
    cor: cor('viz.2'),
  },
  { chave: 'influenza', rotulo: 'Influenza', cor: cor('viz.3') },
  { chave: 'nao_especificado', rotulo: 'Não especificado', cor: cor('viz.4') },
  { chave: 'em_investigacao', rotulo: 'Em investigação', cor: cor('viz.5') },
  { chave: 'outro_agente', rotulo: 'Outro agente', cor: cor('viz.6') },
]

export const EVOLUCOES: { chave: Evolucao; rotulo: string; cor: string }[] = [
  { chave: 'cura', rotulo: 'Cura', cor: cor('viz.1') },
  { chave: 'obito', rotulo: 'Óbito por SRAG', cor: cor('viz.2') },
  {
    chave: 'obito_outras_causas',
    rotulo: 'Óbito por outras causas',
    cor: cor('viz.3'),
  },
  { chave: 'ignorado', rotulo: 'Ignorado', cor: cor('viz.4') },
  { chave: 'em_aberto', rotulo: 'Em aberto', cor: cor('viz.5') },
]

export const FAIXAS_ETARIAS: { chave: FaixaEtaria; rotulo: string }[] = [
  { chave: 'menor_1', rotulo: '< 1' },
  { chave: '1_4', rotulo: '1–4' },
  { chave: '5_9', rotulo: '5–9' },
  { chave: '10_19', rotulo: '10–19' },
  { chave: '20_29', rotulo: '20–29' },
  { chave: '30_39', rotulo: '30–39' },
  { chave: '40_49', rotulo: '40–49' },
  { chave: '50_59', rotulo: '50–59' },
  { chave: '60_69', rotulo: '60–69' },
  { chave: '70_79', rotulo: '70–79' },
  { chave: '80_mais', rotulo: '80+' },
]

export const AGENTES: Record<Agente, string> = {
  covid19: 'SARS-CoV-2 (covid-19)',
  influenza_a: 'Influenza A',
  influenza_b: 'Influenza B',
  influenza_nao_tipado: 'Influenza (sem tipo)',
  vsr: 'Vírus sincicial respiratório',
  rinovirus: 'Rinovírus',
  adenovirus: 'Adenovírus',
  metapneumovirus: 'Metapneumovírus',
  bocavirus: 'Bocavírus',
  parainfluenza_1: 'Parainfluenza 1',
  parainfluenza_2: 'Parainfluenza 2',
  parainfluenza_3: 'Parainfluenza 3',
  parainfluenza_4: 'Parainfluenza 4',
  outro: 'Outro vírus',
}
