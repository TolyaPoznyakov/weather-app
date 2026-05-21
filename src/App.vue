<script setup>
import { apiRequest } from "@/composables/apiRequest.js";
import { ref, onMounted, computed } from "vue";
import WeatherSearch from "@/components/WeatherSearch.vue";
import WeatherCard from "@/components/WeatherCard.vue";
import { getWeatherBackground } from "@/composables/useWeatherBackground.js";


const data = ref(null);
const searchCity = ref("Kyiv");

const fetchWeather = async (city) => {
  data.value = await apiRequest(city, 1);
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
    <WeatherSearch
        :searchCity="searchCity"
        @update:searchCity="searchCity = $event"
        @search="fetchWeather(searchCity)"
    />
    <WeatherCard
        v-if="data"
        :data="data"
    />
    <div v-else class="loading">
      Loading...
    </div>
  </div>
</template>

<style scoped>

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30px 30px 30px;
  font-family: system-ui, sans-serif;
  transition: background 0.6s ease;
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