import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { DownloadIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { baixarArquivo, gerarCsv } from '../helpers/csv'
import {
  useAnos,
  useResumo,
  useSemanas,
  useSerieHistorica,
} from '../hooks/use-srag'
import { AgeChart } from './charts/age-chart'
import { AgentsChart } from './charts/agents-chart'
import { AnnualChart } from './charts/annual-chart'
import { TimelineChart } from './charts/timeline-chart'
import { WeeklyChart } from './charts/weekly-chart'
import { Footer } from './layout/footer'
import { Header } from './layout/header'
import { KpiGrid } from './overview/kpi-grid'
import { OutcomeBar } from './overview/outcome-bar'
import { PandemicHighlight } from './overview/pandemic-highlight'
import { YearFilter, type Selecao } from './overview/year-filter'

export const ANOS_PANDEMIA = [2020, 2021]
const PRIMEIRO_ANO_POS_PANDEMIA = 2023

export function anosPosPandemia(anos: number[]) {
  return anos.filter((a) => a >= PRIMEIRO_ANO_POS_PANDEMIA)
}

function intervalo(anos: number[]) {
  if (anos.length === 0) return ''
  const min = Math.min(...anos)
  const max = Math.max(...anos)
  return min === max ? String(min) : `${min}–${max}`
}

export function Dashboard() {
  const router = useRouter()
  const { data: dadosAnos, error: erroAnos, mutate } = useAnos()
  const linhas = dadosAnos?.dados
  const listaAnos = useMemo(
    () => linhas?.map((l) => l.ano).sort((a, b) => a - b),
    [linhas],
  )
  const ultimoAno = listaAnos?.[listaAnos.length - 1]

  const selecao: Selecao | null = useMemo(() => {
    if (!listaAnos) return null
    const consulta = router.query.ano
    if (consulta === 'todos') return 'todos'
    const ano = Number(consulta)
    return listaAnos.includes(ano) ? ano : ultimoAno ?? null
  }, [listaAnos, router.query.ano, ultimoAno])

  const anoSelecionado = typeof selecao === 'number' ? selecao : null
  const linhaAno = linhas?.find((l) => l.ano === anoSelecionado)
  const anoAnterior =
    anoSelecionado && listaAnos?.includes(anoSelecionado - 1)
      ? anoSelecionado - 1
      : null

  const resumo = useResumo(
    selecao === null ? null : selecao === 'todos' ? undefined : [selecao],
  )
  const semanas = useSemanas(anoSelecionado)
  const semanasAnterior = useSemanas(anoAnterior)
  const historico = useSerieHistorica(listaAnos)
  const seriesHistoricas = useMemo(
    () => historico.data?.map((e) => e.dados),
    [historico.data],
  )

  const anosRecentes = listaAnos ? anosPosPandemia(listaAnos) : []
  const resumoPandemia = useResumo(listaAnos ? ANOS_PANDEMIA : null)
  const resumoRecente = useResumo(anosRecentes.length > 0 ? anosRecentes : null)

  const rotuloPeriodo =
    selecao === 'todos'
      ? intervalo(listaAnos ?? [])
      : linhaAno?.parcial
      ? `${linhaAno.ano} até a SE ${linhaAno.semanasNoPeriodo}`
      : String(anoSelecionado ?? '')

  function selecionar(nova: Selecao) {
    const query = nova === ultimoAno ? {} : { ano: String(nova) }
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  function baixarCsv() {
    const cabecalho = [
      'ano',
      'semana_epidemiologica',
      'inicio',
      'fim',
      'casos',
      'internados_uti',
      'obitos_srag',
    ]
    if (selecao === 'todos' && seriesHistoricas) {
      const linhasCsv = seriesHistoricas.flatMap((s) =>
        s.semanas.map((p) => [
          s.ano,
          p.semana,
          p.inicio,
          p.fim,
          p.casos,
          p.internadosUti,
          p.obitosSrag,
        ]),
      )
      baixarArquivo(
        'srag-lagarto-semanas-todos-os-anos.csv',
        gerarCsv(cabecalho, linhasCsv),
      )
      return
    }
    const serie = semanas.data?.dados
    if (!serie) return
    const linhasCsv = serie.semanas.map((p) => [
      serie.ano,
      p.semana,
      p.inicio,
      p.fim,
      p.casos,
      p.internadosUti,
      p.obitosSrag,
    ])
    baixarArquivo(
      `srag-lagarto-semanas-${serie.ano}.csv`,
      gerarCsv(cabecalho, linhasCsv),
    )
  }

  const podeBaixar =
    selecao === 'todos' ? Boolean(seriesHistoricas) : Boolean(semanas.data)

  return (
    <Box minH='100vh'>
      <Header />

      <Container
        as='main'
        maxW='7xl'
        px={{ base: 4, md: 8 }}
        pt={{ base: 6, md: 10 }}
      >
        <Stack spacing={{ base: 6, md: 8 }}>
          <Box maxW='48rem'>
            <Heading
              as='h1'
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight='700'
              lineHeight='1.15'
            >
              Síndrome respiratória aguda grave em{' '}
              <Box as='span' whiteSpace='nowrap'>
                Lagarto-SE
              </Box>
            </Heading>
            <Text
              mt={3}
              fontSize={{ base: 'md', md: 'lg' }}
              color='ink.secondary'
            >
              Internações e óbitos por SRAG de moradores de Lagarto, de 2019 até
              hoje: o que a pandemia de covid-19 deixou e como estão os casos
              agora.
            </Text>
          </Box>

          {erroAnos && (
            <Alert status='error' borderRadius='xl' alignItems='flex-start'>
              <AlertIcon />
              <Box flex='1'>
                <AlertTitle>Não foi possível falar com a API.</AlertTitle>
                <AlertDescription display='block' fontSize='sm'>
                  {erroAnos instanceof Error
                    ? erroAnos.message
                    : 'Tente de novo em alguns minutos.'}
                </AlertDescription>
              </Box>
              <Button size='sm' onClick={() => mutate()}>
                Tentar de novo
              </Button>
            </Alert>
          )}

          <PandemicHighlight anos={linhas} carregando={!linhas && !erroAnos} />

          <TimelineChart
            series={seriesHistoricas}
            carregando={!seriesHistoricas && !historico.error}
            erro={historico.error}
          />

          <Box
            as='section'
            aria-label='Filtro de período'
            position='sticky'
            top={14}
            zIndex='docked'
            bg='page'
            py={3}
            mx={{ base: -4, md: -8 }}
            px={{ base: 4, md: 8 }}
            borderBottomWidth='1px'
            borderColor='line.border'
          >
            <Flex justify='space-between' align='center' gap={3} wrap='wrap'>
              <Box minW={0} maxW='100%'>
                <Text fontSize='xs' color='ink.muted' mb={1}>
                  Período dos indicadores abaixo
                </Text>
                <YearFilter
                  anos={listaAnos}
                  selecionado={selecao}
                  aoSelecionar={selecionar}
                />
              </Box>
              <Button
                size='sm'
                variant='outline'
                leftIcon={<DownloadIcon />}
                onClick={baixarCsv}
                isDisabled={!podeBaixar}
              >
                Baixar CSV semanal
              </Button>
            </Flex>
          </Box>

          <KpiGrid
            resumo={resumo.data?.dados}
            linhaAno={linhaAno}
            carregando={!resumo.data && !resumo.error}
          />

          {anoSelecionado && (
            <WeeklyChart
              serie={semanas.data?.dados}
              serieAnterior={semanasAnterior.data?.dados}
              parcial={Boolean(linhaAno?.parcial)}
              carregando={!semanas.data && !semanas.error}
              erro={semanas.error}
            />
          )}

          <OutcomeBar
            resumo={resumo.data?.dados}
            rotuloPeriodo={rotuloPeriodo}
            carregando={!resumo.data && !resumo.error}
          />

          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={{ base: 6, md: 8 }}
          >
            <AnnualChart
              anos={linhas}
              anoSelecionado={anoSelecionado}
              carregando={!linhas && !erroAnos}
              erro={erroAnos}
            />
            <AgentsChart
              resumo={resumo.data?.dados}
              rotuloPeriodo={rotuloPeriodo}
              carregando={!resumo.data && !resumo.error}
              erro={resumo.error}
            />
          </Grid>

          <AgeChart
            pandemia={resumoPandemia.data?.dados}
            recente={resumoRecente.data?.dados}
            rotuloPandemia={intervalo(ANOS_PANDEMIA)}
            rotuloRecente={intervalo(anosRecentes)}
            carregando={!resumoPandemia.data || !resumoRecente.data}
            erro={resumoPandemia.error ?? resumoRecente.error}
          />
        </Stack>
      </Container>

      <Footer aviso={resumo.data?.aviso} />
    </Box>
  )
}
