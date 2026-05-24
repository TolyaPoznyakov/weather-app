<script setup>
import { apiRequest } from "@/composables/apiRequest.js";
import { ref, onMounted, computed } from "vue";
import WeatherSearch from "@/components/WeatherSearch.vue";
import WeatherCard from "@/components/WeatherCard.vue";
import WeatherChart from "@/components/WeatherChart.vue";
import ForecastSwitch from "@/components/ForecastSwitch.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import NavBar from "@/components/NavBar.vue";
import { getWeatherBackground } from "@/composables/useWeatherBackground.js";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const data = ref(null);
const searchCity = ref("");
const forecastMode = ref("day");
const currentPage = ref("weather");


const fetchWeather = async (city) => {
  data.value = await apiRequest(city, 3);
};

const backgroundStyle = computed(() => ({
  background: getWeatherBackground(
      data.value?.current?.condition?.code,
      data.value?.current?.is_day
  )
}));

onMounted(async () => {
  data.value = await apiRequest("auto:ip", 3)
  searchCity.value = data.value.location.name
})
</script>

<template>
  <div class="page" :style="backgroundStyle">
    <div class="weather-title-lang">
      <NavBar
          :currentPage="currentPage"
          @update:currentPage="currentPage = $event"
      />
      <div v-if="currentPage === 'weather'" class="weather-toolbar">
        <ForecastSwitch
            v-model="forecastMode"
        />
        <LanguageSwitcher />
      </div>
    </div>
    <div v-if="currentPage === 'weather'">
      <div class="weather-search">
        <WeatherSearch
            :searchCity="searchCity"
            @update:searchCity="searchCity = $event"
            @search="fetchWeather(searchCity)"
        />
      </div>
      <div>
        <div  v-if="data" class="weather-block">
          <WeatherCard
              :data="data"
              :mode="forecastMode"
          />
          <WeatherChart
              :forecast="data.forecast"
              :mode="forecastMode"
          />
        </div>
        <div v-else class="loading">
          {{ t('common.loading') }}
        </div>
      </div>
    </div>
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
}

.weather-toolbar  {
  display: flex;
  gap: 20px;
}

.weather-title-lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-search  {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-block  {
  display: flex;
  gap: 20px;
}

.loading {
  color: white;
  font-size: 24px;
  font-weight: 700;
}
</style>