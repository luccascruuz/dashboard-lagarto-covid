import { Grid, GridItem } from '@chakra-ui/react'
import styled from 'styled-components'
import { CardConfirmed } from './card-confirmed'
import { ChartCovid } from './chart-covid'

const ContainerDashboard = styled.div`
  padding: 7rem 5rem 5rem 2rem;
  height: 100vh;
  width: 100%;
`

export function Dashboard() {
  return (
    <ContainerDashboard>
      <Grid templateAreas={`"confirmed charts"`} templateColumns='25% 1fr' gap='3rem' height="80vh">
        <GridItem area={'confirmed'}>
          <CardConfirmed />
        </GridItem>
        <GridItem area={'charts'}>
          <ChartCovid />
        </GridItem>
      </Grid>
    </ContainerDashboard>
  )
}
