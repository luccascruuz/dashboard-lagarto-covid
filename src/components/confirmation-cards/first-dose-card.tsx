import { Card, CardBody, Heading, Skeleton, Text } from '@chakra-ui/react'
import { formatNumber } from '../../helpers/format-number'
interface IFirstDoseCard {
  isLoading: boolean
  firstVaccinationNumber: number
}
export function FirstDoseCard({
  firstVaccinationNumber,
  isLoading,
}: IFirstDoseCard) {
  return (
    <Card
      align='center'
      style={{ boxShadow: '1px 1px 3px 2px #348e91' }}
      width='13.75rem'
      key='firstDoseCard'
    >
      <CardBody>
        <Heading textAlign='center' size='md'>
          Vacinas aplicadas
        </Heading>
        {isLoading ? (
          <Skeleton height='20px' />
        ) : (
          <>
            <Heading color='black' textAlign='center'>
              {formatNumber(firstVaccinationNumber)}
            </Heading>
            <Text align='center' fontSize='xs'>
              (D1 + D2 + DU + DR)
            </Text>
          </>
        )}
      </CardBody>
    </Card>
  )
}
