import { useApiCovid } from './use-api-covid'
import { IVaccinationApplied } from '../types'

export function useVaccinationsApplied() {
  const { data, isLoading } = useApiCovid<IVaccinationApplied>(
    '/total-doses-applied',
  )

  return {
    data: data?.data || {
      firstDose: 0,
      secondDose: 0,
      thirdDose: 0,
      fourthDose: 0,
      fifthDose: 0,
      totalDoses: 0,
    },
    isLoading,
  }
}
