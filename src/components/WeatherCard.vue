<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  data: Object,
  mode: {
    type: String,
    default: "day"
  }
});

const forecast = computed(() => {
  if (!props.data?.forecast?.forecastday) return null;

  if (props.mode === "day") {
    return props.data.forecast.forecastday[0];
  } else {
    const days = props.data.forecast.forecastday;
    const avgTemp = Math.round(days.reduce((sum, d) => sum + d.day.avgtemp_c, 0) / days.length);
    const avgHumidity = Math.round(days.reduce((sum, d) => sum + d.day.avghumidity, 0) / days.length);
    const avgWind = Math.round(days.reduce((sum, d) => sum + d.day.maxwind_kph, 0) / days.length);
    const avgPressure = Math.round(days.reduce((sum, d) => sum + d.day.pressure_mb, 0) / days.length);

    return {
      day: {
        avgtemp_c: avgTemp,
        avghumidity: avgHumidity,
        maxwind_kph: avgWind,
        pressure_mb: avgPressure
      },
      mode: "3days"
    };
  }
});
</script>

<template>
  <div class="card-wrapper">
    <div class="card-inner">
      <div class="card front">
        <div class="top">
          <div>
            <h2 class="city">{{ data.location.name }}</h2>
            <p class="desc">
              {{ props.mode === "day" ? data.current.condition.text : t('weatherCard.forecast') }}
            </p>
          </div>
          <img
              v-if="props.mode === 'day'"
              class="icon"
              :src="`https:${data.current.condition.icon}`"
              alt="weather icon"
          />
        </div>

        <div class="temp">
          {{ props.mode === "day" ? Math.round(data.current.temp_c) : forecast.day.avgtemp_c }}°
        </div>

        <div class="grid">
          <div class="item">
            <span>{{ t('weatherCard.feelsLike') }}</span>
            <b>{{ props.mode === "day" ? Math.round(data.current.feelslike_c) : forecast.day.avgtemp_c }}°C</b>
          </div>
          <div class="item">
            <span>{{ t('weatherCard.humidity') }}</span>
            <b>{{ props.mode === "day" ? data.current.humidity : forecast.day.avghumidity }}%</b>
          </div>
          <div class="item">
            <span>{{ t('weatherCard.wind') }}</span>
            <b>{{ props.mode === "day" ? data.current.wind_kph : forecast.day.maxwind_kph }} km/h</b>
          </div>
          <div class="item">
            <span>{{ t('weatherCard.pressure') }}</span>
            <b>{{ props.mode === "day" ? data.current.pressure_mb : forecast.day.pressure_mb }} hPa</b>
          </div>
        </div>
      </div>

      <div class="card back">
        <h2 class="forecast-title">
          {{ props.mode === "day" ? t('weatherCard.hourlyForecast') : t('weatherCard.threeDayForecast') }}
        </h2>

        <div v-if="props.mode === 'day'" class="hourly-list">
          <div
              v-for="hour in forecast.hour.slice(0, 24)"
              :key="hour.time_epoch"
              class="hour-item"
          >
            <span class="hour">{{ hour.time.split(' ')[1].slice(0, 5) }}</span>
            <div class="hour-center">
              <img :src="`https:${hour.condition.icon}`" class="hour-icon" alt="" />
              <span class="condition">{{ hour.condition.text }}</span>
            </div>
            <span class="hour-temp">{{ Math.round(hour.temp_c) }}°</span>
          </div>
        </div>

        <div v-else class="hourly-list">
          <div
              v-for="day in props.data.forecast.forecastday"
              :key="day.date"
              class="hour-item"
          >
            <span class="hour">{{ day.date }}</span>
            <div class="hour-center">
              <img :src="`https:${day.day.condition.icon}`" class="hour-icon" alt="" />
              <span class="condition">{{ day.day.condition.text }}</span>
            </div>
            <span class="hour-temp">{{ Math.round(day.day.avgtemp_c) }}°C</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  perspective: 1400px;
}

.card-inner {
  position: relative;
  width: 430px;
  height: 610px;
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  color: white;
  backface-visibility: hidden;
  box-sizing: border-box;
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
</style>