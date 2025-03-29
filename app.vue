<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// Import PrimeVue components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import 'primeicons/primeicons.css'
import ProgressSpinner from 'primevue/progressspinner'

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

// Table data fields and header
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

// Table Data for the CSV importation

const dataTable = ref(null)

const exportToCSV = () => {
  // console.log('General Data:', generalData.value) // Debug log
  if (dataTable.value) {
    dataTable.value.exportCSV()
  }
}

// Add Loading State
const isLoading = ref(false)

// Fetch cryptocurrency prices
const fetchCryptoData = async () => {
  isLoading.value = true
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
    // console.log('Product Array :', products.value)
  } catch (err) {
    error.value = (err as Error).message
    // console.error('An error occurred while fetching crypto prices:', err)
  } finally {
    isLoading.value = false
  }
}

// Fetch cryptocurrency description
const fetchCryptoInfosData = async () => {
  isLoading.value = true
  try {
    // console.log('Fetching description for crypto:', cryptoType.value)
    const { data } = await useFetch<CryptoInfos>(`/api/infos/${cryptoType.value}`)
    // console.log('Fetched data infos:', data.value)

    // Extract data description for the selected cryptocurrency
    cryptoInfos.value = data.value || null
  } catch (err) {
    error.value = (err as Error).message
    // console.error('An error occurred while fetching crypto description:', err)
  } finally {
    isLoading.value = false
  }
}

// Fetch crypto coin infos
const fetchCryptoCoinAssets = async () => {
  isLoading.value = true
  try {
    // console.log('Fetching crypto coin assets:', cryptoType.value)
    const { data } = await useFetch<CryptoAssets[]>('/api/coins')
    // console.log('Fetched data coin assets:', data.value)

    // Ensure the response is an array
    cryptoCoin.value = Array.isArray(data.value) ? data.value : []
    // console.log('Crypto Coin Array :', cryptoCoin.value) // debug
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
    // console.error('An error occured while fetching crypto assets : ', e)
  } finally {
    isLoading.value = false
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
  <div v-if="cryptoCoin">
    <!-- Global Proogress Spinner when all data fetch for the first time -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-grey-700/50 z-50"
    >
      <ProgressSpinner />
    </div>

    <nav class="bg-emerald-800/75 p-6 rounded-br-lg rounded-bl-lg shadow-[0_0_20px_rgba(16,185,129,0.7)] mb-4">
      <h1 class="text-4xl text-center p-4 font-semibold">
        Cryptocurrency Prices
      </h1>
    </nav>
    <!-- Display table regrouping all cryptocurrency -->
    <div v-if="cryptoCoin" class="w-full">
      <Card class="shadow-lg rounded-lg p-4">
        <template #title>
          <h2 class="text-2xl p-2">
            ₿ Cryptocurrencies Current Price (in Eur)
          </h2>
        </template>
      </Card>
      <br></br>
      <DataTable
        ref="dataTable"
        paginator
        :rows="5"
        :value="generalData"
        striped-rows
        table-style="min-width: 50rem"
      >
        <!-- Export CSV Button -->
        <template #header>
          <div class="text-end pb-4">
            <Button icon="pi pi-external-link" label="Export to CSV" @click="exportToCSV()" />
          </div>
        </template>

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
    <Card class="shadow-lg rounded-lg p-2 m-2">
      <template #title>
        <div>
          <label for="cryptoType">
            Select Cryptocurrency :
          </label>
          <select id="cryptoType" v-model="cryptoType" class="rounded-md ml-8" @change="onCryptoChange">
            <option v-for="asset in cryptoCoin || []" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>
      </template>
    </Card>

    <!-- Display the cryptocurrency infos if available -->
    <div v-if="cryptoInfos">
      <Card :loading="isLoading" class="shadow-lg rounded-lg p-6">
        <template #title>
          <div class="flex items-center space-x-4">
            <img :src="cryptoInfos.image.small" alt="Crypto Image" class="w-10 h-10 rounded-full" />
            <h2 class="text-xl font-bold">
              {{ cryptoInfos.name }}
            </h2>
          </div>
        </template>

        <template #content>
          <p class="text-justify">
            {{ cryptoInfos.description.en }}
          </p>
        </template>
      </Card>
    </div>

    <!-- Display error message if an error occurs -->
    <div v-else>
      <p>{{ error }}</p>
    </div>

    <!-- Display the cryptocurrency data if available -->
    <div v-if="cryptoCurrency && cryptoCurrency.usd && cryptoCurrency.eur" class="mt-6">
      <div class="flex flex-row space-x-6">
        <!-- Table Section -->
        <div class="flex-1">
          <Card :loading="isLoading">
            <template #title>
              <h2>
                💱 Prices for {{ cryptoType }}
              </h2>
            </template>
          </Card>
          <DataTable
            :loading="isLoading"
            :value="products"
            striped-rows
            table-style="min-width: 100%"
          >
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
          </DataTable>
        </div>

        <!-- Chart Section -->
        <div class="flex-1">
          <Card :loading="isLoading">
            <template #title>
              <h2>📈 Evolution of {{ cryptoType }}'s Value</h2>
            </template>
          </Card>
          <Chart
            type="line"
            :loading="isLoading"
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
                  backgroundColor: 'rgba(210, 43, 43, 0.1)',
                  borderColor: '#D22B2B',
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
          />
        </div>
      </div>
    </div>
    <!-- Show a message if no data is found
    <div v-else>
      <Card>
        <template #title>
          <h2 class="text-center">No Data available for this crypto currency</h2>
        </template>
      </Card>
    </div> -->

    <!-- Footer -->
    <footer class="bg-emerald-700/45 p-6 rounded-tr-lg rounded-tl-lg shadow-[0_0_20px_rgba(16,185,129,0.7)] mt-4">
      <p class="text-center mb-2 mt-4">
        Made by Mai with ❣️
      </p>
      <p class="text-center mb-4">
        Project made for Dadoun's Technical Assessment
      </p>
    </footer>
  </div>

  <!-- Show a message if no data is found -->
  <div v-else>
    <Card>
      <template #title>
        <h2 class="text-center">
          No Data available for this crypto currency
        </h2>
      </template>
    </Card>
  </div>
</template>

<!-- End of the View -->

<style scoped>
</style>
