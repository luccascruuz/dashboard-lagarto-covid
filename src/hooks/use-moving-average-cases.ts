import { IMovingAverageCases } from '../types'
import { useApiCovid } from './use-api-covid'

export function useMovingAverageCases() {
  const { data, isLoading } = useApiCovid<IMovingAverageCases[]>(
    '/moving-average-of-cases',
  )

  return {
    data: data?.data ?? [],
    isLoading,
  }
}
