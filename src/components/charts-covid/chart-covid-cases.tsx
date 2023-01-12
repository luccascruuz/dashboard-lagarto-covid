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

interface IChartCovidCasesProps {
  paddingBox: string
  isMobile: boolean
  dataCases: ICasesCovid[]
}

export function ChartCovidCases({
  dataCases,
  isMobile,
  paddingBox,
}: IChartCovidCasesProps) {
  const transDataCovidCases = dataCases.map((cases) => {
    return {
      data: format(addHours(new Date(cases.date), 3), 'dd/MM/yy'),
      casos: cases.new_cases,
    }
  })

  return (
    <Box
      boxShadow='0.5px 0.5px 1.5px 1px #348e91'
      w='80%'
      display='flex'
      padding={paddingBox}
      flexDirection='column'
      borderRadius='0.5rem'
      alignItems='center'
      gap='0.5rem'
    >
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
  )
}
