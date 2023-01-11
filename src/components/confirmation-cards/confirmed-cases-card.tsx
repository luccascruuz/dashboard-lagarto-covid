import { Card, CardBody, Heading, Skeleton, Text } from '@chakra-ui/react'
import { formatNumber } from '../../helpers/format-number'
import { format, addHours } from 'date-fns'

interface IConfirmedCasesCardProp {
  isLoading: boolean
  dateConfirmedCases: string
  confirmedCases: number
}

export function ConfirmedCasesCard({
  confirmedCases,
  dateConfirmedCases,
  isLoading,
}: IConfirmedCasesCardProp) {
  return (
    <Card
      align='center'
      textAlign='center'
      style={{ boxShadow: '1px 1px 3px 2px #348e91' }}
      width='13.75rem'
      key='ConfirmedCasesCard'
    >
      <CardBody>
        <Heading size='md'>Casos confirmados</Heading>
        {isLoading ? (
          <Skeleton height='2.5rem' />
        ) : (
          <>
            <Heading color='black' textAlign='center'>
              {formatNumber(confirmedCases)}
            </Heading>
            <Text align='center' fontSize='xs'>
              Atualizado em:{' '}
              {format(addHours(new Date(dateConfirmedCases), 3), 'dd/MM/yyyy')}
            </Text>
          </>
        )}
      </CardBody>
    </Card>
  )
}
