<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// variables
/* const cardType = ref('') */
const creditCards = ref([])
// const error = ref <string | null>(null)

// Fetch Data Request

const fetchDataCreditCards = async () => {
  try {
    const { data } = await useFetch('/api/:type')
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
  </div>
</template>

<style lang="css" scoped>
</style>
