import { ReactNode } from 'react'
import { Box, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import { cor } from '../../helpers/labels'

export const eixo = {
  stroke: cor('line.axis'),
  tick: { fill: cor('ink.muted'), fontSize: 12 },
  tickLine: false,
}

export const grade = {
  stroke: cor('line.grid'),
  vertical: false,
}

export const cursorFaixa = { fill: cor('viz.shade') }
export const cursorLinha = { stroke: cor('line.axis'), strokeWidth: 1 }

interface ItemLegenda {
  rotulo: string
  cor: string
  forma?: 'quadrado' | 'linha'
}

export function Legenda({ itens }: { itens: ItemLegenda[] }) {
  return (
    <Wrap spacingX={4} spacingY={1} as='ul' listStyleType='none'>
      {itens.map((item) => (
        <WrapItem key={item.rotulo} as='li'>
          <HStack spacing={2}>
            <Marca cor={item.cor} forma={item.forma} />
            <Text fontSize='xs' color='ink.secondary'>
              {item.rotulo}
            </Text>
          </HStack>
        </WrapItem>
      ))}
    </Wrap>
  )
}

function Marca({
  cor: corItem,
  forma = 'quadrado',
}: {
  cor: string
  forma?: ItemLegenda['forma']
}) {
  return forma === 'linha' ? (
    <Box w='14px' h='2px' borderRadius='full' bg={corItem} aria-hidden />
  ) : (
    <Box w='10px' h='10px' borderRadius='2px' bg={corItem} aria-hidden />
  )
}

interface LinhaTooltip {
  rotulo: string
  valor: string
  cor?: string
  forma?: ItemLegenda['forma']
}

export function CaixaTooltip({
  titulo,
  linhas,
  nota,
}: {
  titulo: ReactNode
  linhas: LinhaTooltip[]
  nota?: string
}) {
  return (
    <Box
      bg='surface'
      borderWidth='1px'
      borderColor='line.border'
      borderRadius='md'
      boxShadow='lg'
      px={3}
      py={2}
      minW='11rem'
    >
      <Text fontSize='xs' fontWeight='600' mb={1}>
        {titulo}
      </Text>
      <VStack align='stretch' spacing={1}>
        {linhas.map((linha) => (
          <HStack key={linha.rotulo} justify='space-between' spacing={4}>
            <HStack spacing={2}>
              {linha.cor && <Marca cor={linha.cor} forma={linha.forma} />}
              <Text fontSize='xs' color='ink.secondary'>
                {linha.rotulo}
              </Text>
            </HStack>
            <Text
              fontSize='xs'
              fontWeight='600'
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {linha.valor}
            </Text>
          </HStack>
        ))}
      </VStack>
      {nota && (
        <Text mt={2} fontSize='2xs' color='ink.muted' maxW='14rem'>
          {nota}
        </Text>
      )}
    </Box>
  )
}
