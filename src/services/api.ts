import axios from 'axios'


const API = axios.create({ baseURL: 'https://api-covid-lagarto.onrender.com', headers: { "Accept-Encoding": "gzip,deflate,compress" } })

export { API }
