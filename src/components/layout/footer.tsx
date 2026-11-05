import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { formatDate, formatDateTime, formatNumber } from '../../helpers/format'
import { useFonte } from '../../hooks/use-srag'
import { API_URL } from '../../services/api'

export function Footer({ aviso }: { aviso?: string }) {
  const { data } = useFonte()
  const fonte = data?.dados
  const ultimoSucesso = fonte?.sincronizacao.ultimoSucessoEm

  return (
    <Box
      as='footer'
      borderTopWidth='1px'
      borderColor='line.border'
      mt={12}
      py={10}
    >
      <Container maxW='7xl' px={{ base: 4, md: 8 }}>
        <Grid templateColumns={{ base: '1fr', md: '1.2fr 1fr' }} gap={8}>
          <Stack spacing={3} fontSize='sm' color='ink.secondary'>
            <Heading as='h2' size='xs' color='ink.primary'>
              Sobre os dados
            </Heading>
            <Text>
              Casos de síndrome respiratória aguda grave (SRAG) hospitalizados e
              óbitos por SRAG de pessoas que <b>moram</b> em Lagarto-SE, mesmo
              quando internadas em outra cidade. A fonte é o SIVEP-Gripe, do
              Ministério da Saúde, publicado no OpenDataSUS.
            </Text>
            {aviso && <Text>{aviso}</Text>}
            <Text>
              O ano de cada caso é o ano epidemiológico do início dos sintomas.
              A comparação de um ano em andamento usa as mesmas semanas do ano
              anterior.
            </Text>
            <Wrap spacing={4} pt={1}>
              <WrapItem>
                <Link
                  href={
                    fonte?.origem.conjuntoDeDados ??
                    'https://dadosabertos.saude.gov.br'
                  }
                  isExternal
                  color='brand.accent'
                >
                  OpenDataSUS <ExternalLinkIcon mx='2px' />
                </Link>
              </WrapItem>
              <WrapItem>
                <Link href={`${API_URL}/docs`} isExternal color='brand.accent'>
                  Documentação da API <ExternalLinkIcon mx='2px' />
                </Link>
              </WrapItem>
              <WrapItem>
                <Link
                  href={`${API_URL}/status`}
                  isExternal
                  color='brand.accent'
                >
                  Status da API <ExternalLinkIcon mx='2px' />
                </Link>
              </WrapItem>
            </Wrap>
          </Stack>

          <Stack spacing={3} fontSize='sm' color='ink.secondary'>
            <Heading as='h2' size='xs' color='ink.primary'>
              Arquivos usados
            </Heading>
            {ultimoSucesso && (
              <Text>
                Última verificação de arquivos novos:{' '}
                {formatDateTime(ultimoSucesso)}.
              </Text>
            )}
            <Box
              as='ul'
              listStyleType='none'
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {(fonte?.anos ?? [])
                .slice()
                .sort((a, b) => b.ano - a.ano)
                .map((a) => (
                  <Box
                    as='li'
                    key={a.ano}
                    display='flex'
                    justifyContent='space-between'
                    py={1}
                    borderBottomWidth='1px'
                    borderColor='line.border'
                  >
                    <Link href={a.url} isExternal>
                      {a.ano}
                    </Link>
                    <Text as='span'>
                      publicado em {formatDate(a.publicadoEm)} ·{' '}
                      {formatNumber(a.totalCasos)} casos
                    </Text>
                  </Box>
                ))}
            </Box>
          </Stack>
        </Grid>
      </Container>
    </Box>
  )
}
