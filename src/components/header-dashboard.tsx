import { Heading } from '@chakra-ui/react'
import styled from 'styled-components'
import { ButtonCsvDownload } from './button-csv-download'

const ContainerHeader = styled.header`
  display: flex;
  position: fixed;
  width: 100%;
  background-color: #213635;
  padding: 18px 10%;
  color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 10001;
  justify-content: space-between;
  align-items: center;
`

export function HeaderDashboard() {
  return (
    <ContainerHeader>
      <Heading size='sm'>Painel Lagarto COVID-19</Heading>
      <ButtonCsvDownload />
    </ContainerHeader>
  )
}
