import { Box, Flex, Heading, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import { formatNumber, formatPercent, fracao } from '../../helpers/format'
import { EVOLUCOES } from '../../helpers/labels'
import type { Resumo } from '../../types/srag'
import { Legenda } from '../charts/chart-parts'

const LARGURA_MINIMA_ROTULO = 0.08

interface OutcomeBarProps {
  resumo?: Resumo
  rotuloPeriodo: string
  carregando?: boolean
}

export function OutcomeBar({
  resumo,
  rotuloPeriodo,
  carregando,
}: OutcomeBarProps) {
  const total = resumo?.totalCasos ?? 0
  const partes = EVOLUCOES.map((e) => ({
    ...e,
    valor: resumo?.porEvolucao[e.chave] ?? 0,
  })).filter((p) => p.valor > 0)
  const descricao = partes
    .map(
      (p) =>
        `${p.rotulo}: ${formatNumber(p.valor)} (${formatPercent(
          fracao(p.valor, total),
        )})`,
    )
    .join('; ')

  return (
    <Box
      as='section'
      bg='surface'
      borderWidth='1px'
      borderColor='line.border'
      borderRadius='xl'
      p={{ base: 4, md: 6 }}
    >
      <Heading as='h2' size='sm' fontWeight='600'>
        Como terminaram os casos · {rotuloPeriodo}
      </Heading>
      <Text mt={1} mb={4} fontSize='sm' color='ink.secondary'>
        Evolução registrada na ficha de notificação.
      </Text>

      {carregando || !resumo ? (
        <Skeleton h='28px' borderRadius='md' />
      ) : total === 0 ? (
        <Text fontSize='sm' color='ink.secondary'>
          Nenhum caso neste período.
        </Text>
      ) : (
        <>
          <Flex
            h='28px'
            gap='2px'
            role='img'
            aria-label={`Desfecho dos casos. ${descricao}`}
          >
            {partes.map((p) => {
              const parte = fracao(p.valor, total)
              return (
                <Tooltip
                  key={p.chave}
                  label={`${p.rotulo}: ${formatNumber(
                    p.valor,
                  )} (${formatPercent(parte, 1)})`}
                  hasArrow
                  openDelay={100}
                >
                  <Flex
                    tabIndex={0}
                    flexGrow={p.valor}
                    flexBasis={0}
                    minW='2px'
                    bg={p.cor}
                    borderRadius='4px'
                    align='center'
                    px={2}
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'brand.accent',
                      outlineOffset: '2px',
                    }}
                  >
                    {parte >= LARGURA_MINIMA_ROTULO && (
                      <Text
                        fontSize='xs'
                        fontWeight='600'
                        color={p.chave === 'ignorado' ? '#0b0b0b' : '#ffffff'}
                      >
                        {formatPercent(parte)}
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              )
            })}
          </Flex>
          <Box mt={3}>
            <Legenda
              itens={partes.map((p) => ({
                rotulo: `${p.rotulo} (${formatNumber(p.valor)})`,
                cor: p.cor,
              }))}
            />
          </Box>
        </>
      )}
    </Box>
  )
}
