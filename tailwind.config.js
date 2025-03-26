/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}', // All files in the components directory
    './layouts/**/*.vue', // All files in the layouts directory
    './pages/**/*.vue', // All files in the pages directory
    './plugins/**/*.{js,ts}', // All files in the plugins directory
    './app.vue', // The main app.vue file
    './nuxt.config.{js,ts}'// The Nuxt.js config file
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
