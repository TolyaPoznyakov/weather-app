import { ref } from "vue"
import axios from "axios"
import api from "@/api/client"
import { FORECAST_DAYS } from "@/utils/constants"

export function useWeatherApi() {
  const loading = ref(false)
  const error = ref(null)

  let searchController = null

  const fetchForecast = async (city = "auto:ip", days = FORECAST_DAYS) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get("/forecast.json", {
        params: { q: city, days },
      })
      return { data, error: null }
    } catch (err) {
      const apiError = err?.response?.data?.error ?? {
        message: err?.message ?? "Unknown error",
      }
      error.value = apiError
      return { data: null, error: apiError }
    } finally {
      loading.value = false
    }
  }

  const searchCities = async (query) => {
    if (searchController) {
      searchController.abort()
    }
    searchController = new AbortController()

    loading.value = true
    error.value = null
    try {
      const { data } = await api.get("/search.json", {
        params: { q: query },
        signal: searchController.signal,
      })
      return Array.isArray(data) ? data : []
    } catch (err) {
      if (axios.isCancel(err) || err?.name === "CanceledError") {
        return null
      }
      error.value = err?.response?.data?.error ?? { message: err?.message }
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