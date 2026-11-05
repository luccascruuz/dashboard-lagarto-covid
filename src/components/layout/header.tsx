import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react'
import { formatDateTime } from '../../helpers/format'
import { useSaude } from '../../hooks/use-srag'

const ESTADOS = {
  ok: { rotulo: 'Dados em dia', cor: 'status.goodDot' },
  degradado: { rotulo: 'Sincronização atrasada', cor: 'status.warningDot' },
  indisponivel: { rotulo: 'Dados indisponíveis', cor: 'status.criticalDot' },
} as const

function StatusBadge() {
  const { data, error } = useSaude()
  const estado = error
    ? ESTADOS.indisponivel
    : data
    ? ESTADOS[data.status]
    : null
  if (!estado) return null

  const detalhe = data?.ultimoSucessoSincronizacao
    ? `Última sincronização com o Ministério da Saúde: ${formatDateTime(
        data.ultimoSucessoSincronizacao,
      )}`
    : 'Não foi possível consultar a API agora.'

  return (
    <Tooltip label={detalhe} hasArrow>
      <HStack
        spacing={2}
        px={2.5}
        py={1}
        borderRadius='full'
        bg='whiteAlpha.200'
        tabIndex={0}
        aria-label={`${estado.rotulo}. ${detalhe}`}
      >
        <Box w='8px' h='8px' borderRadius='full' bg={estado.cor} aria-hidden />
        <Text fontSize='xs' display={{ base: 'none', sm: 'block' }}>
          {estado.rotulo}
        </Text>
      </HStack>
    </Tooltip>
  )
}

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const escuro = colorMode === 'dark'

  return (
    <Box
      as='header'
      bg='brand.header'
      color='white'
      position='sticky'
      top={0}
      zIndex='sticky'
      boxShadow='sm'
    >
      <Container maxW='7xl' px={{ base: 4, md: 8 }}>
        <Flex h={14} align='center' justify='space-between' gap={3}>
          <HStack spacing={3} minW={0}>
            <Box
              w='10px'
              h='10px'
              borderRadius='full'
              bg='#5cb8bb'
              flexShrink={0}
              aria-hidden
            />
            <Text
              fontWeight='700'
              fontSize={{ base: 'sm', md: 'md' }}
              noOfLines={1}
            >
              Painel SRAG · Lagarto-SE
            </Text>
          </HStack>
          <HStack spacing={2}>
            <StatusBadge />
            <IconButton
              aria-label={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
              icon={escuro ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              size='sm'
              variant='ghost'
              color='white'
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
