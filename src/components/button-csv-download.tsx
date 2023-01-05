import { Button } from '@chakra-ui/react'
import { CSVLink } from 'react-csv'
// import { DownloadIcon } from '@chakra-ui/icons'
import { useCasesDayCovid } from '../hooks/use-cases-day-covid'
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
    { label: 'Óbitos por 100 mil habitantes', key: 'deaths_per_100k_inhabitants' },
    { label: 'Casos por 100 mil habitantes', key: 'totalCases_per_100k_inhabitants' },
    { label: 'Óbitos por total de casos', key: 'deaths_by_totalCases' },
    { label: 'Número da semana', key: 'week_number' },
  ]

  const csvCovidLagarto = {
    filename: 'casos-covid-lagarto.csv',
    headers: headerCSV,
    data: data,
  }
  return (
    <Button size="sm" colorScheme='teal' isLoading={isLoading}>
      <CSVLink {...csvCovidLagarto}>Download CSV</CSVLink>
    </Button>
  )
}
