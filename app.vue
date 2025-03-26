<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// Import PrimeVue components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Chart from 'primevue/chart'

// Define the structure of the API response
interface CryptoCurrency {
  usd: number
  eur: number
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
const cryptoType = ref('bitcoin') // Default cryptocurrency
const cryptoData = ref<CryptoCurrency | null>(null) // To store the fetched cryptocurrency prices
const cryptoInfos = ref<CryptoInfos | null>(null) // To store the fetched cryptocurrency information
const error = ref<string | null>(null) // To store any error messages

// Table data
const columns = ref([
  { field: 'currency', header: 'Currency' },
  { field: 'price', header: 'Price' }
])

const products = ref([])

// Fetch cryptocurrency prices
const fetchCryptoData = async () => {
  try {
    console.log('Fetching data for crypto:', cryptoType.value)
    const { data } = await useFetch<Record<string, CryptoCurrency>>(`/api/${cryptoType.value}`)
    console.log('Fetched data:', data.value)

    // Extract the data for the selected cryptocurrency
    cryptoData.value = data.value?.[cryptoType.value] || null

    // Update the products array for the table
    if (cryptoData.value) {
      products.value = []
      for (const [currency, price] of Object.entries(cryptoData.value)) {
        products.value.push({ currency, price })
      }
    }
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
    console.error('An error occurred while fetching crypto infos:', err)
  }
}

// Handle dropdown change
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
    <div v-if="cryptoData && cryptoData.usd && cryptoData.eur">
      <div>
        <h2>Prices for {{ cryptoType }}</h2>
        <DataTable :value="products" striped-rows table-style="min-width: 50rem">
          <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
        </DataTable>
      </div>
      <div>
        <Chart type="bar"
               :data="{
                 labels: ['USD', 'EUR'],
                 datasets: [
                   {
                     label: 'Price',
                     data: [cryptoData.usd, cryptoData.eur],
                     backgroundColor: ['#42A5F5', '#66BB6A'],
                     borderColor: '#42A5F5',
                     borderWidth: 1,
                   },
                 ],
               }"
               :options="{
                 scales: {
                   y: { beginAtZero: true,
                        ticks: { stepSize: 200 }
                   }
                 }
               }"
        /> <br />
      </div>
    </div>

    <!-- Show a message if no data is found -->
    <div v-else>
      <p>No data available for the selected cryptocurrency.</p>
    </div>
    <Button label="Verify" />
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
  padding: 5px
}

ul {
  list-style-type: none;
  padding: 0
}

li {
  margin: 5px 0
}
</style>
