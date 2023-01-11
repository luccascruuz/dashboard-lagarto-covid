import { Card, CardBody, Heading, Skeleton, Text } from '@chakra-ui/react'
import { formatNumber } from '../../helpers/format-number'
import { format, addHours } from 'date-fns'

interface INewCasesCardProp {
  isLoading: boolean
  dateCasesToday: string
  casesToday: number
}

export function NewCasesCard({
  dateCasesToday,
  isLoading,
  casesToday,
}: INewCasesCardProp) {
  return (
    <Card
      align='center'
      style={{ boxShadow: '1px 1px 3px 2px #348e91' }}
      width='13.75rem'
      key='NewCasesCard'
    >
      <CardBody>
        <Heading textAlign='center' size='md'>
          Novos casos
        </Heading>
        {isLoading ? (
          <Skeleton height='20px' />
        ) : (
          <>
            <Heading color='black' textAlign='center'>
              {formatNumber(casesToday)}
            </Heading>
            <Text align='center' fontSize='xs'>
              Atualizado em:{' '}
              {format(addHours(new Date(dateCasesToday), 3), 'dd/MM/yyyy')}
            </Text>
          </>
        )}
      </CardBody>
    </Card>
  )
}
