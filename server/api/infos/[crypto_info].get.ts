import { defineEventHandler, createError } from 'h3'
import { fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  // Retrieve the 'crypto' parameter from the route
  const cryptoName = event.context.params?.crypto_info
  console.log('cryptoName:', cryptoName)

  if (!cryptoName) {
    throw createError({
      statusCode: 400,
      message: 'No Crypto Name provided'
    })
  }

  // Fetch Data from API
  const baseURL: string =
    `https://api.coingecko.com/api/v3/coins/${cryptoName}`
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
    console.error('Error :', e)
    throw createError({
      statusCode: 500,
      message: 'An error happened, no data fetched'
    })
  }
})
