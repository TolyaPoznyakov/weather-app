<script setup>
import { useWeatherApi } from "@/composables/useWeatherApi.js"
import { ref, onMounted, computed, watch } from "vue"
import LocationSearch from "@/components/LocationSearch.vue"
import WeatherCard from "@/components/WeatherCard.vue"
import WeatherChart from "@/components/WeatherChart.vue"
import ForecastSwitch from "@/components/ForecastSwitch.vue"
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"
import NavBar from "@/components/NavBar.vue"
import { getWeatherBackground } from "@/composables/useWeatherBackground.js"
import { useI18n } from "vue-i18n"
import BaseModal from "@/components/BaseModal.vue"
import { useModal } from "@/composables/useModal"
import { useFavorites } from "@/composables/useFavorites"
import { isSameLocation, locationQuery } from "@/utils/location"
import { MAX_CITIES, FORECAST_DAYS } from "@/utils/constants"

const { t, locale } = useI18n()
const modal = useModal()
const { fetchForecast } = useWeatherApi()
const { favorites, remove: removeFavorite, update: updateFavorite } = useFavorites()

const cities = ref([])
const selectedIndex = ref(0)
const searchCity = ref("")
const forecastMode = ref("day")
const currentPage = ref("weather")
const errorMessage = ref("")
const initialLoad = ref(true)

const selectedCity = computed(() => cities.value[selectedIndex.value] || null)

const fetchWeather = async (city) => {
  errorMessage.value = ""
  const { data, error } = await fetchForecast(city, FORECAST_DAYS)

  if (error || !data) {
    errorMessage.value = t("common.cityNotFound")
    return null
  }

  const existingIndex = cities.value.findIndex((c) => isSameLocation(c, data))
  if (existingIndex !== -1) {
    cities.value.splice(existingIndex, 1, data)
    selectedIndex.value = existingIndex
    updateFavorite(data)
    return data
  }

  if (cities.value.length >= MAX_CITIES) {
    await modal.alert(t("common.modal.cityLimitDesc"), t("common.modal.cityLimitTitle"))
    return null
  }

  cities.value.unshift(data)
  selectedIndex.value = 0
  updateFavorite(data)
  return data
}

const onSearch = async () => {
  const query = searchCity.value.trim()
  if (!query) return
  const result = await fetchWeather(query)
  if (result) searchCity.value = ""
}

const removeCity = (index) => {
  if (cities.value.length <= 1) return

  const wasSelected = index === selectedIndex.value
  cities.value.splice(index, 1)

  if (wasSelected) {
    selectedIndex.value = Math.min(selectedIndex.value, cities.value.length - 1)
  } else if (index < selectedIndex.value) {
    selectedIndex.value -= 1
  }
}

const backgroundStyle = computed(() => ({
  background: getWeatherBackground(
      selectedCity.value?.current?.condition?.code,
      selectedCity.value?.current?.is_day
  ),
}))

watch(
    locale,
    (newLocale) => {
      document.documentElement.setAttribute("lang", newLocale)
    },
    { immediate: true }
)

watch(locale, async () => {
  if (!cities.value.length) return
  const refreshed = await Promise.all(
      cities.value.map(async (city) => {
        const { data } = await fetchForecast(locationQuery(city), FORECAST_DAYS)
        return data ?? city
      })
  )
  cities.value = refreshed
  refreshed.forEach((city) => updateFavorite(city))
})

onMounted(async () => {
  await fetchWeather("auto:ip")
  initialLoad.value = false
})
</script>

<template>
  <div class="page" :style="backgroundStyle">
    <div class="weather-title-lang">
      <NavBar :current-page="currentPage" @update:current-page="currentPage = $event" />
      <div v-if="currentPage === 'weather'" class="weather-toolbar">
        <ForecastSwitch v-model="forecastMode" />
        <LanguageSwitcher />
      </div>
    </div>
    <div v-if="currentPage === 'favorite'">
      <div class="favorite-list">
        <TransitionGroup name="fade" tag="div" class="favorite-list">
          <WeatherCard
              v-for="favorite in favorites"
              :key="`${favorite.location.name}-${favorite.location.country}-${favorite.location.region ?? ''}`"
              :weather="favorite"
              :mode="forecastMode"
              @remove="removeFavorite(favorite)"
          />
        </TransitionGroup>
      </div>
    </div>
    <div v-if="currentPage === 'weather'">
      <div class="weather-search">
        <LocationSearch
            :search-city="searchCity"
            @update:search-city="searchCity = $event"
            @search="onSearch"
        />
        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>
      </div>
      <div v-if="cities.length" class="weather-block">
        <TransitionGroup name="fade" tag="div" class="cities-grid">
          <WeatherCard
              v-for="(city, index) in cities"
              :key="`${city.location.name}-${city.location.country}-${city.location.region ?? ''}`"
              :weather="city"
              :mode="forecastMode"
              :selected="index === selectedIndex"
              :removable="cities.length > 1"
              @select="selectedIndex = index"
              @remove="removeCity(index)"
          />
        </TransitionGroup>
        <div v-if="selectedCity" class="chart-wrapper">
          <WeatherChart :forecast="selectedCity.forecast" :mode="forecastMode" />
        </div>
      </div>
      <div v-else-if="initialLoad" class="loading">
        {{ t("common.loading") }}
      </div>
    </div>
    <BaseModal />
  </div>
</template>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 30px;
  font-family: system-ui, sans-serif;
  transition: background 0.6s ease;
  overflow-x: hidden;
}

.weather-toolbar {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.weather-title-lang {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.weather-search {
  width: 100%;
}

.error-message {
  margin: -16px 0 20px;
  padding: 12px 18px;
  border-radius: 12px;
  background: rgba(220, 53, 69, 0.18);
  border: 1px solid rgba(255, 120, 120, 0.4);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  backdrop-filter: blur(10px);
}

.weather-block {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.cities-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
}

.favorite-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .page {
    padding: 20px;
  }

  .weather-title-lang {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .weather-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .weather-block {
    gap: 18px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 14px;
  }

  .weather-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .favorite-list,
  .cities-grid {
    gap: 12px;
  }
}
</style>
