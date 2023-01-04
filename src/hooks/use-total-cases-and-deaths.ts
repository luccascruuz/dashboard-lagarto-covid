import { ITotalCasesAndDeaths } from '../types'
import { useApiCovid } from './use-api-covid'

export function useTotalCasesAndDeaths() {
  const { data, isLoading } = useApiCovid<ITotalCasesAndDeaths>('/total-cases-and-deaths')

  return {
    data: data?.data || { totalCases: 0, totalDeaths: 0, date: '', casesToday: 0, deathsToday: 0 },
    isLoading,
  }
}
