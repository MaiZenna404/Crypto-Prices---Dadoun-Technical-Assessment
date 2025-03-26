// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  typescript: {
    typeCheck: true,
    strict: false
  },

  modules: ['@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module'],

  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})
