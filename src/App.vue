<script setup>
import { apiRequest } from "@/composables/apiRequest.js";
import { ref, onMounted, computed } from "vue";

const data = ref(null);
const searchCity = ref("Kyiv");

const fetchWeather = async (city) => {
  data.value = await apiRequest(city, 1);
};

const forecast = computed(() => {
  return data.value?.forecast?.forecastday?.[0];
});

const getBg = (code) => {
  if (!code) return "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)";

  const map = {
    sunny: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246],
    thunder: [1087, 1273, 1276],
    snow: [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282]
  };

  if (map.sunny.includes(code)) return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
  if (map.clouds.includes(code)) return "linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)";
  if (map.mist.includes(code)) return "linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)";
  if (map.rain.includes(code)) return "linear-gradient(135deg, #314755 0%, #26a0da 100%)";
  if (map.thunder.includes(code)) return "linear-gradient(135deg, #232526 0%, #414345 100%)";
  if (map.snow.includes(code)) return "linear-gradient(135deg, #e6dada 0%, #274046 100%)";

  return "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)";
};

const backgroundStyle = computed(() => ({
  background: getBg(data.value?.current?.condition?.code)
}));

onMounted(() => {
  fetchWeather(searchCity.value);
});
</script>

<template>
  <div class="page" :style="backgroundStyle">
    <h1 class="title">Weather Forecast</h1>

    <div class="search">
      <input
          v-model="searchCity"
          type="text"
          placeholder="Enter city..."
          @keyup.enter="fetchWeather(searchCity)"
      />

      <button @click="fetchWeather(searchCity)">
        Search
      </button>
    </div>

    <div v-if="data" class="card-wrapper">
      <div class="card-inner">

        <div class="card front">
          <div class="top">
            <div>
              <h2 class="city">{{ data.location.name }}</h2>

              <p class="desc">
                {{ data.current.condition.text }}
              </p>
            </div>

            <img
                class="icon"
                :src="`https:${data.current.condition.icon}`"
                alt="weather icon"
            />
          </div>

          <div class="temp">
            {{ Math.round(data.current.temp_c) }}°
          </div>

          <div class="grid">
            <div class="item">
              <span>Feels like</span>
              <b>{{ Math.round(data.current.feelslike_c) }}°C</b>
            </div>

            <div class="item">
              <span>Humidity</span>
              <b>{{ data.current.humidity }}%</b>
            </div>

            <div class="item">
              <span>Wind</span>
              <b>{{ data.current.wind_kph }} km/h</b>
            </div>

            <div class="item">
              <span>Pressure</span>
              <b>{{ data.current.pressure_mb }} hPa</b>
            </div>
          </div>
        </div>

        <div class="card back">
          <h2 class="forecast-title">Hourly Forecast</h2>

          <div class="hourly-list">
            <div
                v-for="hour in forecast.hour.slice(10, 24)"
                :key="hour.time_epoch"
                class="hour-item"
            >
              <span class="hour">
                {{ hour.time.split(' ')[1].slice(0, 5) }}
              </span>

              <div class="hour-center">
                <img
                    :src="`https:${hour.condition.icon}`"
                    class="hour-icon"
                    alt=""
                />

                <span class="condition">
                  {{ hour.condition.text }}
                </span>
              </div>

              <span class="hour-temp">
                {{ Math.round(hour.temp_c) }}°
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="loading">
      Loading...
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
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

.search {
  display: flex;
  gap: 14px;

  margin-bottom: 28px;
}

.search input {
  width: 260px;
  padding: 14px 18px;
  border: none;
  border-radius: 16px;
  outline: none;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 15px;
  backdrop-filter: blur(10px);
}

.search input::placeholder {
  color: rgba(255,255,255,0.7);
}

.search button {
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s;
}

.search button:hover {
  transform: translateY(-2px);
}

.card-wrapper {
  perspective: 1400px;
}

.card-inner {
  position: relative;
  width: 470px;
  height: 650px;
  transform-style: preserve-3d;
  transition: transform 0.9s;
}

.card-wrapper:hover .card-inner {
  transform: rotateY(180deg);
}

.card {
  position: absolute;

  width: 100%;
  height: 100%;
  padding: 34px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  color: white;
  backface-visibility: hidden;
}

.front {
  z-index: 2;
}

.back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.city {
  font-size: 34px;
  font-weight: 800;
}

.desc {
  margin-top: 8px;
  font-size: 17px;
  opacity: 0.9;
}

.icon {
  width: 90px;
  height: 90px;
}

.temp {
  margin: 30px 0;
  font-size: 110px;
  font-weight: 900;
  line-height: 1;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.item {
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  transition: 0.25s;
}

.item:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.18);
}

.item span {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.75;
}

.item b {
  font-size: 18px;
}

.forecast-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 34px;
  font-weight: 800;
}

.hourly-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
}

.hourly-list::-webkit-scrollbar {
  width: 6px;
}

.hourly-list::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.25);
  border-radius: 20px;
}

.hour-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255,255,255,0.12);
  transition: 0.25s;
}

.hour-item:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.18);
}

.hour {
  width: 70px;
  font-size: 17px;
  font-weight: 700;
}

.hour-center {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.hour-icon {
  width: 42px;
  height: 42px;
}

.condition {
  font-size: 14px;
  opacity: 0.85;
}

.hour-temp {
  font-size: 24px;
  font-weight: 800;
}

.loading {
  color: white;
  font-size: 24px;
  font-weight: 700;
}
</style>