<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import { useI18n } from "vue-i18n";
  import { useModal } from "@/composables/useModal";

  const modal = useModal();
  const { t } = useI18n();

  const emit = defineEmits(["favorites-updated"]);

  const props = defineProps({
  data: Object,
  mode: {
  type: String,
  default: "day",
},
});

  const isFlipped = ref(false);
  const isFavorite = ref(false);

  const isDay = computed(() => props.mode === "day");

  const location = computed(() => props.data?.location || {});
  const forecastData = computed(() => props.data?.forecast?.forecastday || []);

  const getFavorites = () =>
  JSON.parse(localStorage.getItem("favorites")) || [];

  const saveFavorites = (favorites) =>
  localStorage.setItem("favorites", JSON.stringify(favorites));

  const isSameLocation = (a, b) =>
  a.location?.name === b.location?.name &&
  a.location?.country === b.location?.country;

  const forecast = computed(() => {
  if (!forecastData.value.length) return null;

  if (isDay.value) {
  return forecastData.value[0];
}

  const days = forecastData.value;

  return {
  day: {
  avgtemp_c: Math.round(days.reduce((s, d) => s + d.day.avgtemp_c, 0) / days.length),
  avghumidity: Math.round(days.reduce((s, d) => s + d.day.avghumidity, 0) / days.length),
  maxwind_kph: Math.round(days.reduce((s, d) => s + d.day.maxwind_kph, 0) / days.length),
  pressure_mb: Math.round(days.reduce((s, d) => s + d.day.pressure_mb, 0) / days.length),
},
};
});

  const forecastDay = computed(() => forecast.value?.day || {});
  const forecastHours = computed(() => forecast.value?.hour?.slice(0, 24) || []);

  const addToFavorites = async () => {
  if (!props.data) return;

  const favorites = getFavorites();

  const exists = favorites.some((f) =>
  isSameLocation(f, props.data)
  );

  if (exists) {
  const updated = favorites.filter((f) => !isSameLocation(f, props.data));
  saveFavorites(updated);
  emit("favorites-updated");
  isFavorite.value = false;
  return;
}

  if (favorites.length >= 5) {
  await modal.alert(
  t("common.modal.desc"),
  t("common.modal.title")
  );
  return;
}

  saveFavorites([...favorites, props.data]);
  emit("favorites-updated");
  isFavorite.value = true;
};

  const checkIsFavorite = () => {
  const favorites = getFavorites();

  isFavorite.value = favorites.some((f) =>
  isSameLocation(f, props.data)
  );
};

  onMounted(checkIsFavorite);

  watch(() => props.data, checkIsFavorite);
</script>

<template>
  <div class="card-wrapper" @click="isFlipped = !isFlipped">
    <div class="card-inner" :class="{ flipped: isFlipped }">

      <div class="card front">
        <div class="top">
          <div>
            <h2 class="city">{{ location.name }}</h2>
            <p class="desc">
              {{ isDay ? props.data.current.condition.text : t('weatherCard.forecast') }}
            </p>
          </div>
          <img
              v-if="isDay"
              class="icon"
              :src="`https:${props.data.current.condition.icon}`"
              alt=""
          />
        </div>

        <div class="temp">
          {{ isDay
            ? Math.round(props.data.current.temp_c)
            : forecastDay.avgtemp_c
          }}°
        </div>

        <div class="grid">
          <div class="item">
            <span>{{ t('weatherCard.feelsLike') }}</span>
            <b>{{ isDay
                ? Math.round(props.data.current.feelslike_c)
                : forecastDay.avgtemp_c
              }}°C</b>
          </div>

          <div class="item">
            <span>{{ t('weatherCard.humidity') }}</span>
            <b>{{ isDay
                ? props.data.current.humidity
                : forecastDay.avghumidity
              }}%</b>
          </div>

          <div class="item">
            <span>{{ t('weatherCard.wind') }}</span>
            <b>{{ isDay
                ? props.data.current.wind_kph
                : forecastDay.maxwind_kph
              }} km/h</b>
          </div>

          <div class="item">
            <span>{{ t('weatherCard.pressure') }}</span>
            <b>{{ isDay
                ? props.data.current.pressure_mb
                : forecastDay.pressure_mb
              }} hPa</b>
          </div>
        </div>

        <button
            class="favorite-btn"
            :class="{ active: isFavorite }"
            @click.stop="addToFavorites"
        >
          <svg viewBox="0 0 24 24">
            <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
            />
          </svg>
        </button>
      </div>

      <div class="card back">
        <h2 class="forecast-title">
          {{ isDay ? t('weatherCard.hourlyForecast') : t('weatherCard.threeDayForecast') }}
        </h2>

        <div v-if="isDay" class="hourly-list">
          <div
              v-for="hour in forecastHours"
              :key="hour.time_epoch"
              class="hour-item"
          >
            <span class="hour">
              {{ hour.time.split(' ')[1].slice(0, 5) }}
            </span>

            <div class="hour-center">
              <img :src="`https:${hour.condition.icon}`" class="hour-icon" alt="" />
              <span class="condition">{{ hour.condition.text }}</span>
            </div>

            <span class="hour-temp">
              {{ Math.round(hour.temp_c) }}°
            </span>
          </div>
        </div>

        <div v-else class="hourly-list">
          <div
              v-for="day in forecastData"
              :key="day.date"
              class="hour-item"
          >
            <span class="hour">{{ day.date }}</span>

            <div class="hour-center">
              <img :src="`https:${day.day.condition.icon}`" class="hour-icon" alt="" />
              <span class="condition">{{ day.day.condition.text }}</span>
            </div>

            <span class="hour-temp">
              {{ Math.round(day.day.avgtemp_c) }}°C
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  perspective: 1400px;
  transition: transform 0.9s;
  cursor: pointer;
}

.card-wrapper:hover {
  transform: scale(1.02);
}

.card-inner {
  position: relative;
  width: 390px;
  height: 560px;
  transform-style: preserve-3d;
  transition: transform 0.9s;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 30px;
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
  display: flex;
  flex-direction: column;
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
  font-size: 30px;
  font-weight: 800;
}

.desc {
  margin-top: 8px;
  font-size: 15px;
  opacity: 0.9;
}

.icon {
  width: 80px;
  height: 80px;
}

.temp {
  margin: 24px 0;
  font-size: 95px;
  font-weight: 900;
  line-height: 1;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.item {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  transition: 0.25s;
}

.item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.18);
}

.item span {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  opacity: 0.75;
}

.item b {
  font-size: 16px;
}

.forecast-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;
  font-weight: 800;
}

.hourly-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
}

.hourly-list::-webkit-scrollbar {
  width: 6px;
}

.hourly-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
}

.hour-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  transition: 0.25s;
}

.hour-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
}

.hour {
  width: 65px;
  font-size: 15px;
  font-weight: 700;
}

.hour-center {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.hour-icon {
  width: 36px;
  height: 36px;
}

.condition {
  font-size: 13px;
  opacity: 0.85;
}

.hour-temp {
  font-size: 21px;
  font-weight: 800;
}

.favorite-btn {
  margin-left: auto;
  margin-top: auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.favorite-btn svg {
  width: 30px;
  height: 30px;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.favorite-btn.active {
  color: #ffd54a;
}

@media (max-width: 1200px) {
  .card-wrapper {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .card-wrapper {
    transform: scale(0.95);
  }
}

@media (max-width: 420px) {
  .card-wrapper {
    transform: scale(0.85);
  }
}
</style>
