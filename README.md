# Painel SRAG Lagarto-SE

Painel com os casos de **síndrome respiratória aguda grave (SRAG)** de moradores de Lagarto-SE, de 2019 até hoje: o que a pandemia de covid-19 deixou e como estão os casos agora.

Os dados vêm da [API SRAG Lagarto-SE](https://api-covid-lagarto-se.vercel.app/docs) (projeto `APICovidLagartoSE`), que lê os microdados do SIVEP-Gripe publicados pelo Ministério da Saúde no OpenDataSUS.

## O que o painel mostra

| Bloco | Rota da API | O que responde |
|---|---|---|
| Da pandemia aos dias de hoje | `/v1/srag/anos` | Quantas vezes menos casos por semana há hoje do que no pior ano da pandemia, e como mudaram os óbitos e a parcela de covid-19 |
| Linha do tempo | `/v1/srag/semanas` (um pedido por ano) | As ondas de SRAG semana a semana desde 2019, com média móvel de 4 semanas de casos e de óbitos. A área sombreada vai da declaração de pandemia pela OMS (11/03/2020) ao fim da emergência internacional (05/05/2023) |
| Indicadores | `/v1/srag/resumo?ano=` e `/v1/srag/anos` | Casos, UTI, óbitos e casos aguardando desfecho do período escolhido. O ano em andamento é comparado com as **mesmas semanas** do ano anterior |
| Casos por semana | `/v1/srag/semanas?ano=` | Barras por semana epidemiológica, com a média móvel do ano e a do ano anterior. As 4 últimas semanas do ano corrente ficam sombreadas porque ainda recebem notificações atrasadas |
| Como terminaram os casos | `/v1/srag/resumo` | Cura, óbito por SRAG, óbito por outras causas, ignorado e em aberto |
| Casos por ano | `/v1/srag/anos` | Classificação final de cada ano: covid-19, outros vírus, influenza, não especificado e em investigação |
| Agentes identificados | `/v1/srag/resumo` | Quais vírus foram detectados no período |
| Quem a SRAG atinge | `/v1/srag/resumo?ano=2020,2021` e `?ano=2023,...` | Faixa etária na pandemia comparada à do pós-pandemia. Os idosos eram quase metade dos casos; hoje a maioria são crianças de até 4 anos |
| Rodapé e status | `/v1/fonte` e `/health` | Arquivo do Ministério usado em cada ano, última sincronização e saúde da API |

O filtro de período fica na URL (`/?ano=2021`, `/?ano=todos`), então dá para compartilhar um recorte. Todo gráfico tem um botão **Ver tabela**, e o botão **Baixar CSV semanal** exporta a série do período escolhido.

## Como funciona

- **Next.js com ISR:** a página é gerada no build com os dados da API já embutidos e é regenerada no máximo a cada 1 hora. Quem abre o painel vê os números na hora, sem esperar a API.
- **SWR no navegador:** depois de carregar, a página confere a API de novo e atualiza a cada 30 minutos. Se a API estiver fora do ar no build, a página sai sem dados e o navegador busca tudo depois.
- **Tema claro e escuro:** segue o sistema e pode ser trocado no cabeçalho. As cores dos gráficos são tokens do tema (`src/styles/theme.ts`), validados para daltonismo nos dois modos.

## Rodando localmente

Requer Node.js 18.17 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Para usar outra instância da API (por exemplo, a API rodando na sua máquina), crie um `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build de produção e servidor |
| `npm test` | Testes (Jest + Testing Library) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos do TypeScript |

## Estrutura

```
src/
├── pages/
│   ├── index.tsx          # página única + getStaticProps (ISR)
│   ├── _app.tsx           # Chakra UI, SWR e fonte
│   └── _document.tsx
├── components/
│   ├── dashboard.tsx      # composição da página e estado do filtro
│   ├── layout/            # cabeçalho (status da API, tema) e rodapé (fontes)
│   ├── overview/          # destaque da pandemia, indicadores, desfecho, filtro de ano
│   └── charts/            # gráficos (Recharts) e o cartão com "Ver tabela"
├── hooks/use-srag.ts      # um hook SWR por rota da API
├── services/api.ts        # endereço da API, rotas e fetcher
├── helpers/               # formatação pt-BR, rótulos, séries e CSV
├── styles/theme.ts        # tokens de cor claro/escuro
└── types/srag.ts          # tipos das respostas da API
```

## Sobre os dados

- Conta como caso a SRAG **hospitalizada** ou o **óbito por SRAG** de quem **mora** em Lagarto, mesmo que internado em outra cidade.
- O ano é o ano epidemiológico do início dos sintomas, e a semana segue o calendário oficial (domingo a sábado).
- As últimas semanas sempre aparecem com menos casos do que terão depois. Casos "em investigação" e "em aberto" ainda vão ser atualizados pelo Ministério.
