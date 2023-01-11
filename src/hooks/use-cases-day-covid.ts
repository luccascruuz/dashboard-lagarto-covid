import { ICasesCovid } from '../types'
import { useApiCovid } from './use-api-covid'

export function useCasesDayCovid() {
  const { data, isLoading } = useApiCovid<ICasesCovid[]>('/cases-day')

  return {
    data: data?.data || [],
    isLoading,
  }
}
