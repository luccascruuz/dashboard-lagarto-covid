import { Heading } from '@chakra-ui/react'
import styled from 'styled-components'

const ContainerHeader = styled.header`
  position: fixed;
  width: 100%;
  background-color: #0026ffc3;
  padding: 22px 10%;
  color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 10001;
`

export function HeaderDashboard() {
  return (
    <ContainerHeader>
      <Heading size="lg">Painel Lagarto COVID-19</Heading>
    </ContainerHeader>
  )
}
