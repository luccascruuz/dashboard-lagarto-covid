import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false,
}

const fonte =
  'var(--font-roboto), system-ui, -apple-system, "Segoe UI", sans-serif'

export const theme = extendTheme({
  config,
  fonts: { heading: fonte, body: fonte },
  semanticTokens: {
    colors: {
      page: { default: '#f4f6f5', _dark: '#0d0d0d' },
      surface: { default: '#fcfcfb', _dark: '#1a1a19' },
      brand: {
        header: { default: '#213635', _dark: '#16201f' },
        accent: { default: '#2b7c7f', _dark: '#5cb8bb' },
      },
      ink: {
        primary: { default: '#0b0b0b', _dark: '#f0efec' },
        secondary: { default: '#52514e', _dark: '#c3c2b7' },
        muted: { default: '#6f6d68', _dark: '#a09e96' },
      },
      line: {
        grid: { default: '#e1e0d9', _dark: '#2c2c2a' },
        axis: { default: '#c3c2b7', _dark: '#383835' },
        border: {
          default: 'rgba(11,11,11,0.10)',
          _dark: 'rgba(255,255,255,0.10)',
        },
      },
      viz: {
        1: { default: '#2a78d6', _dark: '#3987e5' },
        2: { default: '#eb6834', _dark: '#d95926' },
        3: { default: '#1baf7a', _dark: '#199e70' },
        4: { default: '#eda100', _dark: '#c98500' },
        5: { default: '#e87ba4', _dark: '#d55181' },
        6: { default: '#008300', _dark: '#008300' },
        soft: { default: '#9ec5f4', _dark: '#1c5cab' },
        shade: {
          default: 'rgba(11,11,11,0.05)',
          _dark: 'rgba(255,255,255,0.06)',
        },
      },
      status: {
        good: { default: '#006300', _dark: '#0ca30c' },
        critical: { default: '#b42f2f', _dark: '#e66767' },
        goodDot: '#0ca30c',
        warningDot: '#fab219',
        criticalDot: '#d03b3b',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'page',
        color: 'ink.primary',
      },
    },
  },
})
