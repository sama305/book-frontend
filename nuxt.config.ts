// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      backendBaseURL: process.env.NODE_ENV === "development" ? "localhost:8080" : process.env.BACKEND_BASE_URL
    }
  }
})
