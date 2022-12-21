import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;

    font-family: 'Roboto', sans-serif;
  }

  button {
    border: 0;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
`
