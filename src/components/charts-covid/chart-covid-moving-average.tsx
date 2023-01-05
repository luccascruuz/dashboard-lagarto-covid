import { format, addHours } from 'date-fns'
import { Heading, Box } from '@chakra-ui/react'
import { IMovingAverageCases } from '../../types'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

interface CIhartCovidMovingAverageProps {
  paddingBox: string
  isMobile: boolean
  dataMovingAverage: IMovingAverageCases[]
}

export function ChartCovidMovingAverage({
  dataMovingAverage,
  isMobile,
  paddingBox,
}: CIhartCovidMovingAverageProps) {
  const transDataCovidMovingAverageCases = dataMovingAverage.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yy'),
      media: cases.movingAverage,
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
  )
}
