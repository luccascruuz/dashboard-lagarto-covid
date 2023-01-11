import { Heading, Box } from '@chakra-ui/react'
import { format, addHours } from 'date-fns'
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
import { ICasesCovid } from '../../types'

interface IChartCovidDeathsProps {
  paddingBox: string
  isMobile: boolean
  dataDeaths: ICasesCovid[]
}

export function ChartCovidDeaths({
  dataDeaths,
  isMobile,
  paddingBox,
}: IChartCovidDeathsProps) {
  const transDataCovidDeaths = dataDeaths.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yy'),
      óbitos: cases.new_deaths,
    }
  })
  return (
    <Box
      boxShadow='0.5px 0.5px 1.5px 1px #348e91'
      w='80%'
      display='flex'
      flexDirection='column'
      padding={paddingBox}
      alignItems='center'
      gap='0.5rem'
    >
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
  )
}
