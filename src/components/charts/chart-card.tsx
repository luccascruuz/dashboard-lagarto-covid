import { ReactNode, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

interface TabelaDados {
  colunas: string[]
  linhas: (string | number)[][]
}

interface ChartCardProps {
  titulo: string
  subtitulo?: ReactNode
  acoes?: ReactNode
  legenda?: ReactNode
  tabela?: TabelaDados
  carregando?: boolean
  erro?: unknown
  altura?: number | Record<string, number>
  rodape?: ReactNode
  children: ReactNode
}

export function ChartCard({
  titulo,
  subtitulo,
  acoes,
  legenda,
  tabela,
  carregando,
  erro,
  altura = { base: 260, md: 340 },
  rodape,
  children,
}: ChartCardProps) {
  const [verTabela, setVerTabela] = useState(false)

  return (
    <Box
      as='section'
      bg='surface'
      borderWidth='1px'
      borderColor='line.border'
      borderRadius='xl'
      p={{ base: 4, md: 6 }}
      minW={0}
    >
      <Flex
        justify='space-between'
        align='flex-start'
        gap={3}
        mb={4}
        wrap='wrap'
      >
        <Box flex='1' minW='14rem'>
          <Heading as='h2' size='sm' fontWeight='600'>
            {titulo}
          </Heading>
          {subtitulo && (
            <Text mt={1} fontSize='sm' color='ink.secondary'>
              {subtitulo}
            </Text>
          )}
        </Box>
        <HStack spacing={2}>
          {acoes}
          {tabela && !erro && (
            <Button
              size='xs'
              variant='outline'
              onClick={() => setVerTabela((v) => !v)}
              aria-pressed={verTabela}
            >
              {verTabela ? 'Ver gráfico' : 'Ver tabela'}
            </Button>
          )}
        </HStack>
      </Flex>

      {erro ? (
        <Alert status='error' borderRadius='md' variant='subtle'>
          <AlertIcon />
          <AlertDescription fontSize='sm'>
            Não foi possível carregar estes dados agora. Tente de novo em alguns
            minutos.
          </AlertDescription>
        </Alert>
      ) : carregando ? (
        <Skeleton h={altura} borderRadius='md' />
      ) : verTabela && tabela ? (
        <TableContainer maxH='26rem' overflowY='auto'>
          <Table size='sm'>
            <Thead position='sticky' top={0} bg='surface'>
              <Tr>
                {tabela.colunas.map((c, i) => (
                  <Th key={c} isNumeric={i > 0} color='ink.secondary'>
                    {c}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {tabela.linhas.map((linha, i) => (
                <Tr key={i}>
                  {linha.map((celula, j) => (
                    <Td
                      key={j}
                      isNumeric={j > 0}
                      sx={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {celula}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <>
          {legenda && <Box mb={3}>{legenda}</Box>}
          <Box h={altura}>{children}</Box>
        </>
      )}

      {rodape && !erro && (
        <Text mt={3} fontSize='xs' color='ink.muted'>
          {rodape}
        </Text>
      )}
    </Box>
  )
}
