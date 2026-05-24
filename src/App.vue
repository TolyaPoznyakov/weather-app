<script setup>
import { apiRequest } from "@/composables/apiRequest.js";
import { ref, onMounted, computed } from "vue";
import ConfirmModal from "@/components/ConfirmModal.vue"
import WeatherSearch from "@/components/WeatherSearch.vue";
import WeatherCard from "@/components/WeatherCard.vue";
import WeatherChart from "@/components/WeatherChart.vue";
import ForecastSwitch from "@/components/ForecastSwitch.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import CardsList from "@/components/CardsList.vue";
import { getWeatherBackground } from "@/composables/useWeatherBackground.js";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const data = ref(null);
const searchCity = ref("");
const forecastMode = ref("day");
const errorMessage = ref("");

const fetchWeather = async (city) => {
  try {
    errorMessage.value = "";
    const response = await apiRequest(city, 3);
    if (!response || response.error) {
      data.value = null;
      errorMessage.value = "City not found";
      return;
    }
    data.value = response;
  } catch (error) {
    data.value = null;
    errorMessage.value = "City not found";
  }
};

const backgroundStyle = computed(() => ({
  background: getWeatherBackground(
      data.value?.current?.condition?.code,
      data.value?.current?.is_day
  )
}));

const handleCitySelect = (city) => {
  searchCity.value = city
  fetchWeather(city)
}

onMounted(async () => {
  data.value = await apiRequest("auto:ip", 3)
  searchCity.value = data.value.location.name
})
</script>

<template>
  <div class="page" :style="backgroundStyle">
    <div>
      <div class="weather-title-lang">
        <h1 class="title">
          <span class="big-w">W</span>eather Forecast
        </h1>
        <div class="weather-toolbar">
          <ForecastSwitch
              v-model="forecastMode"
          />
          <LanguageSwitcher />
        </div>
      </div>
      <div class="weather-switch-search">
        <WeatherSearch
            :searchCity="searchCity"
            @update:searchCity="searchCity = $event"
            @search="fetchWeather(searchCity)"
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
      <div v-else-if="errorMessage" class="loading">
        {{ errorMessage }}
      </div>
      <div v-else class="loading">
        {{ t('common.loading') }}
      </div>
    </div>
    <div>
      <CardsList @selectCity="handleCitySelect"/>
    </div>
    <ConfirmModal />
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

.weather-switch-search  {
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
  font-size: 40px;
  font-weight: 700;
  margin: 5vh;
}

.title {
  color: white;
  margin-bottom: 28px;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}


.big-w {
  font-size: 52px;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2.5px white;
  background: inherit;
  background-clip: text;
  -webkit-background-clip: text;
  display: inline-block;
}
</style>