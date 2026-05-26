import { ref } from "vue"
import api from "@/api/client"
import { useI18n } from "vue-i18n"

export function useWeatherApi() {
  const loading = ref(false)
  const error = ref(null)
  const { locale } = useI18n()

  const fetchForecast = async (city = "auto:ip", days = 3) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get("/forecast.json", {
        params: { q: city, days, lang: locale.value },
      })
      return data
    } catch (err) {
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }

  const searchCities = async (query) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get("/search.json", {
        params: { q: query, lang: locale.value },
      })
      return Array.isArray(data) ? data : []
    } catch (err) {
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchForecast,
    searchCities,
  }
}
