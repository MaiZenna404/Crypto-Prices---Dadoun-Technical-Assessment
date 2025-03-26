<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// Define the structure of the API response
interface CryptoCurrency {
  usd: number;
  eur: number;
  jpy: number;
}

interface ApiResponse {
  status: string;
  data: Record<string, CryptoCurrency>; // The API returns a dynamic object with crypto names as keys
}

// Reactive variables
const cryptoType = ref('bitcoin') // Default cryptocurrency
const cryptoData = ref<CryptoCurrency | null>(null) // To store the fetched cryptocurrency data
const error = ref<string | null>(null) // To store any error messages

// Fetch Data Request
const fetchCryptoData = async () => {
  try {
    console.log('Fetching data for crypto:', cryptoType.value)
    const { data } = await useFetch<Record<string, CryptoCurrency>>(`/api/${cryptoType.value}`)
    console.log('Fetched data:', data.value)

    // Extract the data for the selected cryptocurrency
    cryptoData.value = data.value?.[cryptoType.value] || null
  } catch (err) {
    error.value = (err as Error).message
    console.error('An error occurred:', err)
  }
}

// Fetch data when the component is mounted
onMounted(() => {
  fetchCryptoData()
})
</script>

<template>
  <div>
    <h1>Cryptocurrency Prices</h1>

    <!-- Dropdown to select cryptocurrency -->
    <div>
      <label for="cryptoType">Select Cryptocurrency:</label>
      <select id="cryptoType" v-model="cryptoType" @change="fetchCryptoData">
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
      </select>
    </div>

    <!-- Display error message if an error occurs -->
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>

    <!-- Display the cryptocurrency data if available -->
    <div v-else-if="cryptoData">
      <h2>Prices for {{ cryptoType }}</h2>
      <ul>
        <li>USD: {{ cryptoData.usd }}</li>
        <li>EUR: {{ cryptoData.eur }}</li>
        <li>JPY: {{ cryptoData.jpy }}</li>
      </ul>
    </div>

    <!-- Show a message if no data is found -->
    <div v-else>
      <p>No data available for the selected cryptocurrency.</p>
    </div>
  </div>
</template>

<style scoped>
/* Add some basic styling */
h1 {
  text-align: center;
}

label {
  font-weight: bold;
}

select {
  margin: 10px 0;
  padding: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
}
</style>
