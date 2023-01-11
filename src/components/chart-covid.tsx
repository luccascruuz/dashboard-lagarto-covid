import { isMobile } from 'react-device-detect'

import { useCasesDayCovid } from '../hooks/use-cases-day-covid'

import { Spinner, Center, VStack } from '@chakra-ui/react'
import { useMovingAverageCases } from '../hooks/use-moving-average-cases'
import { ChartCovidCases } from './charts-covid/chart-covid-cases'
import { ChartCovidDeaths } from './charts-covid/chart-covid-deaths'
import { ChartCovidMovingAverage } from './charts-covid/chart-covid-moving-average'

export function ChartCovid() {
  const { data, isLoading: isLoadingCasesDay } = useCasesDayCovid()
  const { data: dataMovingAverage, isLoading: isLoadingMovingAverage } =
    useMovingAverageCases()

  const paddingBox = isMobile ? '1rem 2rem 1rem 0rem' : '1rem 2rem 1rem 1rem'

  return (
    <>
      {isLoadingCasesDay || isLoadingMovingAverage ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <VStack spacing={10} align='center' padding='2rem 0rem'>
          <ChartCovidCases
            dataCases={data}
            isMobile={isMobile}
            paddingBox={paddingBox}
          />

          <ChartCovidDeaths
            dataDeaths={data}
            isMobile={isMobile}
            paddingBox={paddingBox}
          />

          <ChartCovidMovingAverage
            dataMovingAverage={dataMovingAverage}
            isMobile={isMobile}
            paddingBox={paddingBox}
          />
        </VStack>
      )}
    </>
  )
}
