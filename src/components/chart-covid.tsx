import { format, addHours } from 'date-fns'
import { useCasesDayCovid } from '../hooks/useCasesDayCovid'
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from 'recharts'
import { Spinner, Flex, Heading } from '@chakra-ui/react'

export function ChartCovid() {
  const { data, isLoading } = useCasesDayCovid()

  const transDataCovidCases = data.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yyyy'),
      casos: cases.new_cases,
    }
  })

  const transDataCovidDeaths = data.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yyyy'),
      mortes: cases.new_deaths,
    }
  })

  return (
    <Flex height='100%' direction='column' alignItems='center' justifyContent='center'>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Heading>Casos</Heading>

          <ResponsiveContainer height={250} width={730}>
            <BarChart data={transDataCovidCases}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='data' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='casos' fill='#8884d8' />
            </BarChart>
          </ResponsiveContainer>

          <Heading>Mortes</Heading>
          <BarChart width={730} height={250} data={transDataCovidDeaths}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='data' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='mortes' fill='black' />
          </BarChart>
        </>
      )}
    </Flex>
  )
}
