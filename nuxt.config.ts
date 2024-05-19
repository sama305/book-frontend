// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // if you running nuxt without docker, use 0.0.0.0:8080
      // otherwise, use env var
      backendBaseURL: process.env.DOCK_ENV === undefined ? "http://0.0.0.0:8080"
        : (process.env.NODE_ENV === "development" ? process.env.DEV_BACKEND_BASE_URL 
        : process.env.BACKEND_BASE_URL)
    }
  },
  colorMode: {
    preference: 'light'
  },
  modules: ["@nuxt/ui"],
  ui: {
    icons: ['mdi', 'heroicons']
  }
})