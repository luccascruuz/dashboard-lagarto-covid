import { AxiosResponse } from 'axios'
import { API } from '../services/api'

import useSWR from 'swr'
export function useApiCovid<T>(url: string) {
  const { data, error, isValidating, isLoading } = useSWR<AxiosResponse<T>>(
    url,
    API,
    {
      refreshInterval: 3000000,
    },
  )

  return {
    data,
    isLoading,
    error,
    isValidating,
  }
}
