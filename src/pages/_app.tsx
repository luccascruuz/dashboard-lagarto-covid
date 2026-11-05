import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Roboto } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import { SWRConfig } from 'swr'
import { Analytics } from '@vercel/analytics/next'
import { fetcher } from '../services/api'
import { theme } from '../styles/theme'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Painel SRAG Lagarto-SE</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='Casos, internações em UTI e óbitos por síndrome respiratória aguda grave (SRAG) de moradores de Lagarto-SE, de 2019 até hoje.'
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-roboto:${roboto.style.fontFamily};}`,
          }}
        />
      </Head>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          dedupingInterval: 60 * 1000,
          refreshInterval: 30 * 60 * 1000,
          fallback: pageProps.fallback ?? {},
        }}
      >
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SWRConfig>
      <Analytics />
    </>
  )
}
