import type { NextPage } from 'next'
import { ChakraProvider } from '@chakra-ui/react'
import { Dashboard } from '../components/dashboard'
import { HeaderDashboard } from '../components/header-dashboard'

const Home: NextPage = () => {
  return (
    <ChakraProvider>
      <HeaderDashboard />
      <Dashboard />
    </ChakraProvider>
  )
}

export default Home
