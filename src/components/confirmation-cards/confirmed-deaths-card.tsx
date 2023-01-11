import { Card, CardBody, Heading, Skeleton, Text } from '@chakra-ui/react'
import { formatNumber } from '../../helpers/format-number'
import { format, addHours } from 'date-fns'

interface IConfirmedDeathsCardProp {
  isLoading: boolean
  dateConfirmedDeaths: string
  confirmedDeaths: number
}

export function ConfirmedDeathsCard({
  confirmedDeaths,
  dateConfirmedDeaths,
  isLoading,
}: IConfirmedDeathsCardProp) {
  return (
    <Card
      align='center'
      textAlign='center'
      style={{ boxShadow: '1px 1px 3px 2px #348e91' }}
      width='13.75rem'
      key='ConfirmedDeathsCard'
    >
      <CardBody>
        <Heading size='md'>Óbitos confirmados</Heading>
        {isLoading ? (
          <Skeleton height='20px' />
        ) : (
          <>
            <Heading color='black' textAlign='center'>
              {formatNumber(confirmedDeaths)}
            </Heading>
            <Text align='center' fontSize='xs'>
              Atualizado em:{' '}
              {format(addHours(new Date(dateConfirmedDeaths), 3), 'dd/MM/yyyy')}
            </Text>
          </>
        )}
      </CardBody>
    </Card>
  )
}
