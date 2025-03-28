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
  name: string
  image: {
    small: string
  }
  description: {
    en: string
  }
}

interface CryptoAssets {
  id: string
  name: string
  image: string
  current_price: number
  sparkline_in_7d: {
    price: number[]
  }

}

// Reactive variables
const cryptoType = ref('bitcoin') // Default cryptocurrency
const cryptoCoin = ref<CryptoAssets[]>([]) // To store the fetched cryptocurrency assets
const cryptoCurrency = ref<CryptoCurrency | null>(null) // To store the fetched cryptocurrency prices
const cryptoInfos = ref<CryptoInfos | null>(null) // To store the fetched cryptocurrency information
const error = ref<string | null>(null) // To store any error messages

// Table data
const columns = ref([
  { field: 'currency', header: 'Currency' },
  { field: 'price', header: 'Price' }
])

const columns1 = ref([
  { field: 'image', header: 'Crypto Icon' },
  { field: 'name', header: 'Crypto Name' },
  { field: 'current_price', header: 'Current Price (EUR)' }
])

const products = ref([])
const generalData = ref([])

// Fetch cryptocurrency prices
const fetchCryptoData = async () => {
  try {
    // console.log('Fetching data for crypto:', cryptoType.value)
    const { data } = await useFetch<Record<string, CryptoCurrency>>(`/api/${cryptoType.value}`)
    // console.log('Fetched data:', data.value)

    // Extract the data for the selected cryptocurrency
    cryptoCurrency.value = data.value?.[cryptoType.value] || null

    // Update the products array for the table
    if (cryptoCurrency.value) {
      products.value = []
      for (const [currency, price] of Object.entries(cryptoCurrency.value)) {
        products.value.push({ currency, price })
      }
    }
    console.log('Product Array :', products.value)
  } catch (err) {
    error.value = (err as Error).message
    // console.error('An error occurred while fetching crypto prices:', err)
  }
}

// Fetch cryptocurrency description
const fetchCryptoInfosData = async () => {
  try {
    // console.log('Fetching description for crypto:', cryptoType.value)
    const { data } = await useFetch<CryptoInfos>(`/api/infos/${cryptoType.value}`)
    // console.log('Fetched data infos:', data.value)

    // Extract data description for the selected cryptocurrency
    cryptoInfos.value = data.value || null
  } catch (err) {
    error.value = (err as Error).message
    // console.error('An error occurred while fetching crypto description:', err)
  }
}

// Fetch crypto coin infos
const fetchCryptoCoinAssets = async () => {
  try {
    console.log('Fetching crypto coin assets:', cryptoType.value)
    const { data } = await useFetch<CryptoAssets[]>('/api/coins')
    console.log('Fetched data coin assets:', data.value)

    // Ensure the response is an array
    cryptoCoin.value = Array.isArray(data.value) ? data.value : []
    console.log('Crypto Coin Array :', cryptoCoin.value) // debug
    // Extract the data for the selected cryptocurrency
    // cryptoCoin.value = data.value || []
    // Populate the generalData array for the new table
    generalData.value = cryptoCoin.value.map(asset => ({
      name: asset.name,
      current_price: asset.current_price,
      image: asset.image
    })
    )
  } catch (e) {
    error.value = (e as Error).message
    console.error('An error occured while fetching crypto assets : ', e)
  }
}

// Handle dropdown change
const onCryptoChange = () => {
  fetchCryptoData()
  fetchCryptoInfosData()
  fetchCryptoCoinAssets()
}

// Fetch data when the component is mounted
onMounted(() => {
  fetchCryptoData()
  fetchCryptoInfosData()
  fetchCryptoCoinAssets()
})
</script>

<!-- Start of the View -->
<template>
  <div>
    <h1>Cryptocurrency Prices</h1>

    <!-- Display table regrouping all cryptocurrency -->
    <div v-if="cryptoCoin">
      <h2 class="text-3xl"> All Cryptocurrency Assets </h2>
      <br></br>
      <DataTable paginator :rows="5" :value="generalData" striped-rows table-style="min-width: 50rem">
        <Column v-for="col in columns1" :key="col.field" :field="col.field" :header="col.header" sortable>
          <!-- Custom template for the image field -->
          <template v-if="col.field === 'image'" #body="slotProps">
            <img :src="slotProps.data.image" alt="Crypto Icon" style="width: 30px; height: 30px;" />
          </template>
          <!-- Default rendering for other fields -->
          <template v-else #body="slotProps">
            {{ slotProps.data[col.field] }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dropdown to select cryptocurrency -->
    <div>
      <label for="cryptoType">Select Cryptocurrency:</label>
      <select id="cryptoType" v-model="cryptoType" @change="onCryptoChange">
        <option v-for="asset in cryptoCoin || []" :key="asset.id" :value="asset.id">{{ asset.name }}
        </option>
      </select>
    </div>

    <!-- Display the cryptocurrency infos if available -->
    <div v-if="cryptoInfos">
      <div >
        <h2>{{ cryptoInfos.name }}</h2>
        <img :src="cryptoInfos.image.small" alt="Crypto Image" />
        <p>{{ cryptoInfos.description.en }}</p>
      </div>
    </div>

    <!-- Display error message if an error occurs -->
    <div v-else>
      <p>Error: {{ error }}</p>
    </div>

    <!-- Display the cryptocurrency data if available -->
    <div v-if="cryptoCurrency && cryptoCurrency.usd && cryptoCurrency.eur">
      <div>
        <h2>Prices for {{ cryptoType }}</h2>
        <DataTable :value="products" striped-rows table-style="min-width: 50rem">
          <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
        </DataTable>
      </div>
      <div>
        <Chart
          type="line"
          :data="{
            labels: cryptoCoin && cryptoCoin.length > 0
              ? cryptoCoin.find(asset => asset.id === cryptoType)?.sparkline_in_7d.price.map((_, index) => `Day ${index + 1}`) || []
              : [],
            datasets: [
              {
                label: 'Price Evolution',
                data: cryptoCoin && cryptoCoin.length > 0
                  ? cryptoCoin.find(asset => asset.id === cryptoType)?.sparkline_in_7d.price || []
                  : [],
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                borderColor: '#42A5F5',
                borderWidth: 2,
                fill: true,
              },
            ],
          }"
          :options="{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Days',
                },
              },
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Price (EUR)',
                },
              },
            },
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

<!-- End of the View -->

<style scoped>
</style>
