import { Button } from '@chakra-ui/react'
import { CSVLink } from 'react-csv'
import styled from 'styled-components'
// import { DownloadIcon } from '@chakra-ui/icons'
import { useCasesDayCovid } from '../hooks/use-cases-day-covid'

const ButtonStyled = styled(Button)`
  transition: all 0.45s ease;
  :hover {
    transform: scale(1.05);
  }
`

export function ButtonCsvDownload() {
  const { data, isLoading } = useCasesDayCovid()

  const headerCSV = [
    { label: 'data', key: 'date' },
    { label: 'UF', key: 'uf_state' },
    { label: 'Cidade', key: 'city' },
    { label: 'ibge_id', key: 'ibge_id' },
    { label: 'Novos óbitos', key: 'new_deaths' },
    { label: 'Toral de óbitos', key: 'deaths' },
    { label: 'Novos casos', key: 'new_cases' },
    { label: 'Total de casos', key: 'total_cases' },
    {
      label: 'Óbitos por 100 mil habitantes',
      key: 'deaths_per_100k_inhabitants',
    },
    {
      label: 'Casos por 100 mil habitantes',
      key: 'totalCases_per_100k_inhabitants',
    },
    { label: 'Óbitos por total de casos', key: 'deaths_by_totalCases' },
    { label: 'Número da semana', key: 'week_number' },
  ]

  const csvCovidLagarto = {
    filename: 'casos-covid-lagarto.csv',
    headers: headerCSV,
    data,
  }
  return (
    <ButtonStyled size='sm' colorScheme='teal' isLoading={isLoading}>
      <CSVLink {...csvCovidLagarto}>Download CSV</CSVLink>
    </ButtonStyled>
  )
}
