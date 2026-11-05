import { Button, HStack, Skeleton } from '@chakra-ui/react'

export type Selecao = number | 'todos'

interface YearFilterProps {
  anos?: number[]
  selecionado: Selecao | null
  aoSelecionar: (selecao: Selecao) => void
}

export function YearFilter({
  anos,
  selecionado,
  aoSelecionar,
}: YearFilterProps) {
  if (!anos) return <Skeleton h='2rem' w='min(100%, 32rem)' borderRadius='md' />

  const opcoes: Selecao[] = [...[...anos].sort((a, b) => b - a), 'todos']

  return (
    <HStack
      role='group'
      aria-label='Período'
      spacing={1}
      overflowX='auto'
      maxW='100%'
      pb={1}
      sx={{ scrollbarWidth: 'thin' }}
    >
      {opcoes.map((opcao) => {
        const ativo = opcao === selecionado
        return (
          <Button
            key={opcao}
            size='sm'
            flexShrink={0}
            variant={ativo ? 'solid' : 'ghost'}
            colorScheme={ativo ? 'teal' : 'gray'}
            aria-pressed={ativo}
            onClick={() => aoSelecionar(opcao)}
          >
            {opcao === 'todos' ? 'Todos os anos' : opcao}
          </Button>
        )
      })}
    </HStack>
  )
}
