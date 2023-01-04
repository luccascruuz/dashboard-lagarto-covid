import { Flex } from '@chakra-ui/react'
import styled from 'styled-components'
import { CardConfirmed } from './card-confirmed'
import { ChartCovid } from './chart-covid'

const ContainerDashboard = styled.div`
  padding-top: 4rem;
  height: 100vh;
  width: 100%;
`

export function Dashboard() {
  return (
    <ContainerDashboard>
      <Flex direction='column' gap='2rem'>
        <CardConfirmed />
        <ChartCovid />
      </Flex>
    </ContainerDashboard>
  )
}
