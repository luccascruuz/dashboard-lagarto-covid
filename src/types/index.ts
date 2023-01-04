export interface ICasesCovid {
  date: string
  uf_state: string
  city: string
  ibge_id: string
  new_deaths: number
  deaths: number
  new_cases: number
  total_cases: number
  deaths_per_100k_inhabitants: number
  totalCases_per_100k_inhabitants: number
  deaths_by_totalCases: number
  week_number: number
}

export interface ITotalCasesAndDeaths {
  totalCases: number
  totalDeaths: number
  date: string
  deathsToday: number
  casesToday: number
}

export interface IMovingAverageCases {
  movingAverage: number
  date: string
}
