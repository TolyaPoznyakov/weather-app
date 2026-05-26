<script setup>
import { useWeatherApi } from "@/composables/useWeatherApi.js"
import { ref, onMounted, computed } from "vue"
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

const { t } = useI18n()
const modal = useModal()
const { fetchForecast } = useWeatherApi()

const MAX_CITIES = 5

const cities = ref([])
const selectedIndex = ref(0)
const searchCity = ref("")
const forecastMode = ref("day")
const currentPage = ref("weather")
const favorites = ref([])
const errorMessage = ref("")

const selectedCity = computed(() => cities.value[selectedIndex.value] || null)

const isSameLocation = (a, b) =>
  a?.location?.name === b?.location?.name &&
  a?.location?.country === b?.location?.country &&
  a?.location?.region === b?.location?.region

const fetchWeather = async (city) => {
  try {
    errorMessage.value = ""
    const response = await fetchForecast(city, 3)
    if (!response || response.error) {
      errorMessage.value = t("common.cityNotFound")
      return
    }

    const existingIndex = cities.value.findIndex((c) => isSameLocation(c, response))
    if (existingIndex !== -1) {
      cities.value.splice(existingIndex, 1, response)
      selectedIndex.value = existingIndex
      return
    }

    if (cities.value.length >= MAX_CITIES) {
      await modal.alert(t("common.modal.cityLimitDesc"), t("common.modal.cityLimitTitle"))
      return
    }

    cities.value.unshift(response)
    selectedIndex.value = 0
  } catch (error) {
    errorMessage.value = t("common.cityNotFound")
  }
}

const removeCity = (index) => {
  if (cities.value.length <= 1) return

  cities.value.splice(index, 1)
  if (selectedIndex.value >= cities.value.length) {
    selectedIndex.value = Math.max(0, cities.value.length - 1)
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

const loadFavorites = () => {
  favorites.value = JSON.parse(localStorage.getItem("favorites")) || []
}

onMounted(async () => {
  await fetchWeather("auto:ip")
  loadFavorites()
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
            :key="favorite.location.name"
            :weather="favorite"
            :mode="forecastMode"
            @favorites-updated="loadFavorites"
          />
        </TransitionGroup>
      </div>
    </div>
    <div v-if="currentPage === 'weather'">
      <div class="weather-search">
        <LocationSearch
          :search-city="searchCity"
          @update:search-city="searchCity = $event"
          @search="fetchWeather(searchCity)"
        />
      </div>
      <div v-if="cities.length" class="weather-block">
        <TransitionGroup name="fade" tag="div" class="cities-grid">
          <WeatherCard
            v-for="(city, index) in cities"
            :key="`${city.location.name}-${city.location.country}`"
            :weather="city"
            :mode="forecastMode"
            :selected="index === selectedIndex"
            :removable="cities.length > 1"
            @select="selectedIndex = index"
            @remove="removeCity(index)"
            @favorites-updated="loadFavorites"
          />
        </TransitionGroup>
        <div v-if="selectedCity" class="chart-wrapper">
          <WeatherChart :forecast="selectedCity.forecast" :mode="forecastMode" />
        </div>
      </div>
      <div v-else-if="errorMessage" class="loading">
        {{ errorMessage }}
      </div>
      <div v-else class="loading">
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
