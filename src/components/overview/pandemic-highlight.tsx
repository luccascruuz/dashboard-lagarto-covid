import { Box, Grid, Heading, Skeleton, Stack, Text } from '@chakra-ui/react'
import { formatNumber, formatPercent } from '../../helpers/format'
import { calcularDestaque } from '../../helpers/series'
import type { ComparativoAno } from '../../types/srag'

interface PandemicHighlightProps {
  anos?: ComparativoAno[]
  carregando?: boolean
}

function Comparacao({
  rotulo,
  antes,
  depois,
  nota,
}: {
  rotulo: string
  antes: string
  depois: string
  nota?: string
}) {
  return (
    <Box>
      <Text fontSize='sm' color='ink.secondary'>
        {rotulo}
      </Text>
      <Text fontSize='xl' fontWeight='600' mt={1}>
        {antes}
        <Box as='span' color='ink.muted' mx={2} aria-hidden>
          →
        </Box>
        <Box as='span' srOnly>
          {' '}
          para{' '}
        </Box>
        {depois}
      </Text>
      {nota && (
        <Text fontSize='xs' color='ink.muted' mt={0.5}>
          {nota}
        </Text>
      )}
    </Box>
  )
}

export function PandemicHighlight({
  anos,
  carregando,
}: PandemicHighlightProps) {
  if (carregando || !anos)
    return <Skeleton h={{ base: '22rem', md: '13rem' }} borderRadius='xl' />

  const destaque = calcularDestaque(anos)
  if (!destaque) return null
  const { pico, atual, vezesMenos, partePicoCovid, parteAtualCovid } = destaque
  const ateSemana = atual.parcial ? ` (até a SE ${atual.semanasNoPeriodo})` : ''

  return (
    <Grid
      as='section'
      aria-label='Pandemia e hoje'
      templateColumns={{ base: '1fr', lg: '1.1fr 1fr' }}
      gap={{ base: 6, lg: 10 }}
      bg='surface'
      borderWidth='1px'
      borderColor='line.border'
      borderRadius='xl'
      p={{ base: 5, md: 8 }}
    >
      <Box>
        <Text
          fontSize='xs'
          fontWeight='700'
          letterSpacing='wider'
          textTransform='uppercase'
          color='brand.accent'
        >
          Da pandemia aos dias de hoje
        </Text>
        <Heading
          as='p'
          fontSize={{ base: '5xl', md: '6xl' }}
          fontWeight='700'
          lineHeight='1'
          mt={3}
        >
          {vezesMenos
            ? `${formatNumber(vezesMenos, 1)}×`
            : formatNumber(pico.mediaSemanal, 1)}
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          mt={3}
          color='ink.secondary'
          maxW='32rem'
        >
          {vezesMenos
            ? `menos casos graves por semana em ${atual.ano} do que em ${pico.ano}, o pior ano da pandemia em Lagarto.`
            : `casos por semana em ${pico.ano}, o pior ano da pandemia em Lagarto.`}
        </Text>
      </Box>

      <Stack spacing={5} justify='center'>
        <Comparacao
          rotulo={`Casos de SRAG por semana, ${pico.ano} → ${atual.ano}`}
          antes={formatNumber(pico.mediaSemanal, 1)}
          depois={formatNumber(atual.mediaSemanal, 1)}
          nota={`${formatNumber(pico.totalCasos)} casos em ${
            pico.ano
          }; ${formatNumber(atual.totalCasos)} em ${atual.ano}${ateSemana}.`}
        />
        <Comparacao
          rotulo={`Óbitos por SRAG, ${pico.ano} → ${atual.ano}`}
          antes={formatNumber(pico.obitosSrag)}
          depois={formatNumber(atual.obitosSrag)}
          nota={
            atual.parcial
              ? `${atual.ano} até a SE ${atual.semanasNoPeriodo}.`
              : undefined
          }
        />
        <Comparacao
          rotulo={`Casos causados pela covid-19, ${pico.ano} → ${atual.ano}`}
          antes={formatPercent(partePicoCovid)}
          depois={formatPercent(parteAtualCovid)}
        />
      </Stack>
    </Grid>
  )
}
