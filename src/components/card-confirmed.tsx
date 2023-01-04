import { Wrap } from '@chakra-ui/react'
import { useTotalCasesAndDeaths } from '../hooks/use-total-cases-and-deaths'
import { NewCasesCard } from './confirmation-cards/new-cases-card'
import { NewDeathsCard } from './confirmation-cards/new-deaths-card'
import { ConfirmedCasesCard } from './confirmation-cards/confirmed-cases-card'
import { ConfirmedDeathsCard } from './confirmation-cards/confirmed-deaths-card'

export function CardConfirmed() {
  const { data, isLoading } = useTotalCasesAndDeaths()
  return (
    <Wrap padding='1rem' justify='center' spacing='1.5rem'>
      <NewCasesCard casesToday={data.casesToday} isLoading={isLoading} dateCasesToday={data.date} />

      <NewDeathsCard
        dateDeathsToday={data.date}
        deathsToday={data.deathsToday}
        isLoading={isLoading}
      />

      <ConfirmedCasesCard
        confirmedCases={data.totalCases}
        dateConfirmedCases={data.date}
        isLoading={isLoading}
      />

      <ConfirmedDeathsCard
        dateConfirmedDeaths={data.date}
        confirmedDeaths={data.totalDeaths}
        isLoading={isLoading}
      />
    </Wrap>
  )
}
