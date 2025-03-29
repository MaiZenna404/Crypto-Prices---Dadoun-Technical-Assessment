import { defineEventHandler, createError } from 'h3'
import { fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  // Retrieve the 'crypto' parameter from the route
  const cryptoCurrency = event.context.params?.crypto
  // console.log('crypto:', cryptoCurrency)

  if (!cryptoCurrency) {
    throw createError({
      statusCode: 400,
      message: 'No Crypto Currency provided'
    })
  }

  // Fetch Data from API
  const baseURL: string =
    `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=usd,eur`
  try {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-8BaVmmitoF3s3zqRyafs34r7'
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
