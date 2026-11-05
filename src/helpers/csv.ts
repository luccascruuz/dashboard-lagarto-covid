type Celula = string | number | null | undefined

function escapar(valor: Celula) {
  if (valor === null || valor === undefined) return ''
  const texto = String(valor)
  return /[;"\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

export function gerarCsv(cabecalho: string[], linhas: Celula[][]) {
  return [cabecalho, ...linhas]
    .map((linha) => linha.map(escapar).join(';'))
    .join('\r\n')
}

export function baixarArquivo(
  nome: string,
  conteudo: string,
  tipo = 'text/csv;charset=utf-8',
) {
  const blob = new Blob(['﻿', conteudo], { type: tipo })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nome
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
