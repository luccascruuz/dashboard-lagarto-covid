import { Card, CardBody, Heading, Skeleton, Text } from '@chakra-ui/react'
import { formatNumber } from '../../helpers/format-number'
import { format, addHours } from 'date-fns'

interface INewDeathsCardProp {
  isLoading: boolean
  dateDeathsToday: string
  deathsToday: number
}

export function NewDeathsCard({ dateDeathsToday, deathsToday, isLoading }: INewDeathsCardProp) {

  return (
    <Card
      align='center'
      textAlign='center'
      style={{ boxShadow: '1px 1px 3px 2px #348e91' }}
      width='13.75rem'
    >
      <CardBody>
        <Heading size='md'>Novos óbitos</Heading>

        {isLoading ? (
          <Skeleton height='20px' />
        ) : (
          <>
            <Heading color='black' textAlign='center'>
              {formatNumber(deathsToday)}
            </Heading>
            <Text align='center' fontSize='xs'>
              Atualizado em: {format(addHours(new Date(dateDeathsToday), 3), 'dd/MM/yyyy')}
            </Text>
          </>
        )}
      </CardBody>
    </Card>
  )
}
