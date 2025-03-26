<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// Define the structure of a credit card
interface CreditCard {
  id: number;
  type: string;
  number: string;
  expiration: string;
  owner: string;
}

// Define the structure of the API response
interface ApiResponse {
  status: string;
  data: CreditCard[];
}

// Reactive variables
const cardType = ref('visa') // Default card type
const creditCards = ref<CreditCard[]>([]) // To store the fetched credit card data
const error = ref<string | null>(null) // To store any error messages

// Fetch Data Request

const fetchDataCreditCards = async () => {
  try {
    const { data } = await useFetch<ApiResponse>(`/api/${cardType.value}`)
    creditCards.value = data.value?.data || []
  } catch (error) {
    error.value = (error as Error).message
    console.error('An error had occurred :', error)
  }
}

onMounted(() => {
  fetchDataCreditCards()
})

</script>

<template>
  <div>
    <h1>dadounTest</h1>

    <!-- Dropdown to select card type -->
    <div>
      <label for="cardType">Select Card Type:</label>
      <select id="cardType" v-model="cardType" @change="fetchDataCreditCards">
        <option value="visa">Visa</option>
        <option value="mastercard">MasterCard</option>
        <option value="american express">American Express</option>
        <option value="jcb">JCB</option>
      </select>
    </div>

    <!-- Display error message if an error occurs -->
    <div v-if="error">
      <p>Erreur : {{ error }}</p>
    </div>

    <!-- Display the list of credit cards if data is available -->
    <div v-else-if="creditCards.length > 0">
      <ul>
        <li v-for="card in creditCards" :key="card.id">
          <strong>{{ card.type }}</strong>
          Number: {{ card.number }}
          Expiry: {{ card.expiration }}
          Owner: {{ card.owner }}
        </li>
      </ul>
    </div>

    <!-- Show a message if no credit cards are found -->
    <div v-else>
      <p>Aucune carte de crédit trouvée.</p>
    </div>
    <Button label="Verify" />
  </div>
</template>

<style lang="css" scoped>
</style>
