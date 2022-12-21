import { Card, CardBody, Heading, Skeleton, Flex, CardFooter, Text } from '@chakra-ui/react'
import { formatNumber } from '../helpers/format-number'
import { format, addHours } from 'date-fns'
import { useTotalCasesAndDeaths } from '../hooks/useTotalCasesAndDeaths'

export function CardConfirmed() {
  const { data, isLoading } = useTotalCasesAndDeaths()
  return (
    <Flex direction='column' gap='2rem'>

      <Card align='center' style={{ boxShadow: '0px 0px 25px 0px lightblue' }}>
        <CardBody>
          <Heading textAlign="center" size='md'>Novos casos</Heading>
          {isLoading ? <Skeleton height='20px' /> : null}
          {isLoading ? null : (
            <>
              <Heading color='black' textAlign='center'>
                {formatNumber(data.casesToday)}
              </Heading>
              <Text align='center' fontSize='xs'>
                Atualizado em: {format(addHours(new Date(data.date), 3), 'dd/MM/yyyy')}
              </Text>
            </>
          )}
        </CardBody>
      </Card>

      <Card align='center' textAlign="center" style={{ boxShadow: '0px 0px 25px 0px lightblue' }}>
        <CardBody>
          <Heading size='md'>Novos óbitos</Heading>
          {isLoading ? <Skeleton height='20px' /> : null}
          {isLoading ? null : (
            <>
              <Heading color='black' textAlign='center'>
                {formatNumber(data.deathsToday)}
              </Heading>
              <Text align='center' fontSize='xs'>
                Atualizado em: {format(addHours(new Date(data.date), 3), 'dd/MM/yyyy')}
              </Text>
            </>
          )}
        </CardBody>
      </Card>

      <Card align='center' textAlign="center" style={{ boxShadow: '0px 0px 25px 0px lightblue' }}>
        <CardBody>
          <Heading size='md'>Casos confirmados</Heading>
          {isLoading ? <Skeleton height='2.5rem' /> : null}
          {isLoading ? null : (
            <>
              <Heading color='#3b82f680' textAlign='center'>
                {formatNumber(data.totalCases)}
              </Heading>
              <Text align='center' fontSize='xs'>
                Atualizado em: {format(addHours(new Date(data.date), 3), 'dd/MM/yyyy')}
              </Text>
            </>
          )}
        </CardBody>
      </Card>

      <Card align='center' textAlign="center" style={{ boxShadow: '0px 0px 25px 0px lightblue' }}>
        <CardBody>
          <Heading size='md'>Óbitos confirmados</Heading>
          {isLoading ? <Skeleton height='20px' /> : null}
          {isLoading ? null : (
            <>
              <Heading color='black' textAlign='center'>
                {formatNumber(data.totalDeaths)}
              </Heading>
              <Text align='center' fontSize='xs'>
                Atualizado em: {format(addHours(new Date(data.date), 3), 'dd/MM/yyyy')}
              </Text>
            </>
          )}
        </CardBody>
      </Card>
    </Flex>
  )
}
