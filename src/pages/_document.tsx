import { ColorModeScript } from '@chakra-ui/react'
import { Head, Html, Main, NextScript } from 'next/document'
import { theme } from '../styles/theme'

export default function Document() {
  return (
    <Html lang='pt-BR'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='theme-color' content='#213635' />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
