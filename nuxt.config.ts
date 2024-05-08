// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      backendBaseURL: process.env.NODE_ENV === "development" ? process.env.DEV_BACKEND_BASE_URL : process.env.BACKEND_BASE_URL
    }
  },
  colorMode: {
    preference: 'light'
  },
  modules: ["@nuxt/ui"]
})