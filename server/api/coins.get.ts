import { defineEventHandler, createError } from 'h3'
import { fetch } from 'ofetch'

export default defineEventHandler(async (_event) => {
  // Fetch Data from API
  const baseURL: string =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=25&page=1&sparkline=true'
  try {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })
    // PARSE Json response
    const data = await response.json()
    // console.log('raw data :', data) // debug
    return data
  } catch (e) {
    // console.error('Error :', e)
    throw createError({
      statusCode: 500,
      message: 'An error happened, no data fetched'
    })
  }
})
