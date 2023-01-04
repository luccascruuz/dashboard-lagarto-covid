import { format, addHours } from 'date-fns'
import { isMobile } from 'react-device-detect'

import { useCasesDayCovid } from '../hooks/use-cases-day-covid'
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { Spinner, Heading, Center, StackDivider, VStack, Box } from '@chakra-ui/react'
import { useMovingAverageCases } from '../hooks/use-moving-average-cases'

export function ChartCovid() {
  const { data, isLoading: isLoadingCasesDay } = useCasesDayCovid()
  const { data: dataMovingAverage, isLoading: isLoadingMovingAverage } = useMovingAverageCases()

  const transDataCovidMovingAverageCases = dataMovingAverage.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yy'),
      media: cases.movingAverage,
    }
  })
  const transDataCovidCases = data.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yy'),
      casos: cases.new_cases,
    }
  })

  const transDataCovidDeaths = data.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yy'),
      óbitos: cases.new_deaths,
    }
  })

  return (
    <>
      {isLoadingCasesDay || isLoadingMovingAverage ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <VStack
          divider={<StackDivider borderColor='#348e91' />}
          spacing={5}
          align='center'
          padding='2rem 0rem'
        >
          <Box w='80%' display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
            <Heading size={isMobile ? 'lg' : '2xl'}>Casos</Heading>

            <ResponsiveContainer width='100%' height={isMobile ? 200 : 400}>
              <BarChart data={transDataCovidCases}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='data' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='casos' fill='#348e91' />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box w='80%' display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
            <Heading size={isMobile ? 'lg' : '2xl'}>Óbitos</Heading>

            <ResponsiveContainer width='100%' height={isMobile ? 200 : 400}>
              <BarChart data={transDataCovidDeaths}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='data' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='óbitos' fill='black' />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box w='80%' display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
            <Heading size={isMobile ? 'lg' : '2xl'}>Média móvel de casos</Heading>
            <ResponsiveContainer width='100%' height={isMobile ? 200 : 400}>
              <AreaChart data={transDataCovidMovingAverageCases}>
                <defs>
                  <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#6c788e' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#6c788e' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='data' />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='media'
                  stroke='#6c788e'
                  fillOpacity={1}
                  fill='url(#colorPv)'
                />
                <Bar dataKey='media' fill='#6c788e' />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      )}
    </>
  )
}
