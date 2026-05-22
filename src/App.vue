<script setup>
import { apiRequest } from "@/composables/apiRequest.js";
import { ref, onMounted, computed } from "vue";
import WeatherSearch from "@/components/WeatherSearch.vue";
import WeatherCard from "@/components/WeatherCard.vue";
import WeatherChart from "@/components/WeatherChart.vue";
import ForecastSwitch from "@/components/ForecastSwitch.vue";
import { getWeatherBackground } from "@/composables/useWeatherBackground.js";


const data = ref(null);
const searchCity = ref("Kyiv");
const forecastMode = ref("day");

const fetchWeather = async (city) => {
  data.value = await apiRequest(city, 3);
};

const backgroundStyle = computed(() => ({
  background: getWeatherBackground(
      data.value?.current?.condition?.code,
      data.value?.current?.is_day
  )

}));

onMounted(() => {
  fetchWeather(searchCity.value);
});
</script>

<template>
  <div class="page" :style="backgroundStyle">
    <h1 class="title">Weather Forecast</h1>
    <div class="weather-switch-search">
      <WeatherSearch
          :searchCity="searchCity"
          @update:searchCity="searchCity = $event"
          @search="fetchWeather(searchCity)"
      />
      <ForecastSwitch
          v-model="forecastMode"
      />
    </div>
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
      Loading...
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

.weather-switch-search  {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-block  {
  display: flex;
  gap: 20px;
}

.title {
  color: white;
  margin-bottom: 28px;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.loading {
  color: white;
  font-size: 24px;
  font-weight: 700;
}
</style>