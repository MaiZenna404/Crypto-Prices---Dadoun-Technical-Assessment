<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// Define the structure of the API response
interface CryptoCurrency {
  usd: number
  eur: number
  jpy: number
}

interface CryptoInfos {
  id: string
  name: string
  description: {
    en: string
  }
  image: {
    thumb: string
    small: string
    large: string
  }
  market_data: {
    current_price: {
      usd: number
      eur: number
      jpy: number
    }
  }
}

// Reactive variables
const cryptoType = ref('bitcoin') // Default cryptocurrency in the handledown
const cryptoData = ref<CryptoCurrency | null>(null) // To store the fetched cryptocurrency prices
const cryptoInfos = ref<CryptoInfos | null>(null) // To store the fetched cryptocurrency information
const error = ref<string | null>(null) // To store any error messages

// Fetch cryptocurrency prices
const fetchCryptoData = async () => {
  try {
    console.log('Fetching data for crypto:', cryptoType.value)
    const { data } = await useFetch<Record<string, CryptoCurrency>>(`/api/${cryptoType.value}`)
    console.log('Fetched data:', data.value)

    // Extract the data for the selected cryptocurrency
    cryptoData.value = data.value?.[cryptoType.value] || null
  } catch (err) {
    error.value = (err as Error).message
    console.error('An error occurred while fetching crypto prices:', err)
  }
}

// Fetch cryptocurrency information
const fetchCryptoInfosData = async () => {
  try {
    console.log('Fetching data infos for crypto:', cryptoType.value)
    const { data } = await useFetch<CryptoInfos>(`/api/infos/${cryptoType.value}`)
    console.log('Fetched data infos:', data.value)

    // Extract data infos for the selected cryptocurrency
    cryptoInfos.value = data.value || null
  } catch (err) {
    error.value = (err as Error).message
    // console.error('An error occurred while fetching crypto infos:', err)
  }
}

// Charger les données correspondant à la crypto choisie dans le menu déroulant
// => But : changement dynamique des données à chaque changement de choix
const onCryptoChange = () => {
  fetchCryptoData()
  fetchCryptoInfosData()
}

// Fetch data when the component is mounted
onMounted(() => {
  fetchCryptoData()
  fetchCryptoInfosData()
})
</script>

<template>
  <div>
    <h1>Cryptocurrency Prices</h1>

    <!-- Dropdown to select cryptocurrency -->
    <div>
      <label for="cryptoType">Select Cryptocurrency:</label>
      <select id="cryptoType" v-model="cryptoType" @change="onCryptoChange">
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
      </select>
    </div>

    <!-- Display the cryptocurrency infos if available -->
    <div v-if="cryptoInfos">
      <h2>{{ cryptoInfos.name }}</h2>
      <img :src="cryptoInfos.image.small" alt="Crypto Image" />
      <p>{{ cryptoInfos.description.en }}</p>
    </div>

 <!-- Display error message if an error occurs -->
    <div v-else>
      <p>Error: {{ error }}</p>
    </div>

    <!-- Display the cryptocurrency data if available -->
    <div v-if="cryptoData && cryptoData.usd && cryptoData.eur && cryptoData.jpy">
      <h2>Prices for {{ cryptoType }}</h2>
      <ul>
        <li>USD: {{ cryptoData.usd }}</li>
        <li>EUR: {{ cryptoData.eur }}</li>
        <li>JPY: {{ cryptoData.jpy }}</li>
      </ul>
      <!-- <p>Debug: {{ cryptoData }} is being rendered</p> -->
    </div>

    <!-- Show a message if no data is found -->
    <div v-else>
      <p>No data available for the selected cryptocurrency.</p>
    </div>
    <Button label="Verify">
      Click Here
    </Button>
  </div>
</template>

<style scoped>
/* Add some basic styling */
h1 {
  text-align: center
}

label {
  font-weight: bold
}

select {
  margin: 10px 0;
  padding: 5px;
}

ul {
  list-style-type: none;
  padding: 0
}

li {
  margin: 5px 0
}
</style>
