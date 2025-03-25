import { defineEventHandler } from 'h3'

import { fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const cardType = event.context.params?.type
  console.log('type:', cardType)

  if (!cardType) {
    throw createError({
      statusCode: 400,
      message: 'No Card Type provided'
    })
  }

  try {
    const response = await fetch(`https://fakerapi.it/api/v2/creditCards?type=${cardType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Parse JSON response
    const data = await response.json()

    // Trier les données selon le type de carte donné en paramètres :
    const filteredCard = data.data.filter((card: {type: string}) => card.type.toLowerCase() === cardType.toLowerCase())

    console.log('Fetched data :', filteredCard)
    return data
  } catch (e) {
    /* console.error(e) */
    throw createError(JSON.stringify(
      {
        STATUS_CODES: 500,
        message: 'An error happened, no data fetched'
      }
    ))
  }
})
