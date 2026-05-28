<script setup>
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useModal } from "@/composables/useModal"
import { useFavorites } from "@/composables/useFavorites"
import { X, Star } from "@lucide/vue"

const modal = useModal()
const { t } = useI18n()
const { isFavorite: isFav, toggle: toggleFavorite } = useFavorites()

const emit = defineEmits(["select", "remove"])

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: "day",
  },
  selected: {
    type: Boolean,
    default: false,
  },
  removable: {
    type: Boolean,
    default: false,
  },
})

const isFlipped = ref(false)

const isDay = computed(() => props.mode === "day")
const location = computed(() => props.weather?.location || {})
const current = computed(() => props.weather?.current || {})
const forecastData = computed(() => props.weather?.forecast?.forecastday || [])

const average = (values) => {
  const nums = values.filter((v) => typeof v === "number" && !Number.isNaN(v))
  if (!nums.length) return null
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

const aggregated = computed(() => {
  const days = forecastData.value
  if (!days.length) return null

  const allHours = days.flatMap((d) => d.hour ?? [])

  return {
    avgtemp_c: Math.round(average(days.map((d) => d.day.avgtemp_c)) ?? 0),
    avgfeelslike_c: Math.round(
        average(allHours.map((h) => h.feelslike_c)) ?? average(days.map((d) => d.day.avgtemp_c)) ?? 0
    ),
    avghumidity: Math.round(average(days.map((d) => d.day.avghumidity)) ?? 0),
    maxwind_kph: Math.round(average(days.map((d) => d.day.maxwind_kph)) ?? 0),
    pressure_mb: Math.round(average(allHours.map((h) => h.pressure_mb)) ?? 0),
  }
})

const forecastHours = computed(() => forecastData.value[0]?.hour?.slice(0, 24) ?? [])

const isFavorite = computed(() => isFav(props.weather))

const onFavoriteClick = async () => {
  if (!props.weather) return
  const result = toggleFavorite(props.weather)
  if (!result.ok && result.reason === "limit") {
    await modal.alert(t("common.modal.desc"), t("common.modal.title"))
  }
}

const onCardClick = () => {
  emit("select")
  isFlipped.value = !isFlipped.value
}
</script>

<template>
  <div class="card-wrapper" :class="{ selected }" @click="onCardClick">
    <div class="card-inner" :class="{ flipped: isFlipped }">
    <button
        v-if="removable"
        class="remove-btn"
        :aria-label="t('weatherCard.remove')"
        @click.stop="$emit('remove')"
    >
      <X />
    </button>
      <div class="card front">
        <div class="top">
          <div class="head-text">
            <h2 class="city">{{ location.name }}</h2>
            <p class="desc">
              <template v-if="isDay">
                {{ current.condition?.text }}
                <span v-if="current.is_day !== undefined" class="day-night">
                  · {{ current.is_day ? t("weatherCard.day") : t("weatherCard.night") }}
                </span>
              </template>
              <template v-else>{{ t("weatherCard.forecast") }}</template>
            </p>
          </div>
          <img v-if="isDay && current.condition" class="icon" :src="`https:${current.condition.icon}`" alt="" />
        </div>

        <div class="temp">
          {{ isDay ? Math.round(current.temp_c ?? 0) : (aggregated?.avgtemp_c ?? 0) }}°
        </div>

        <div class="grid">
          <div class="item">
            <span>{{ t("weatherCard.feelsLike") }}</span>
            <b>{{ isDay ? Math.round(current.feelslike_c ?? 0) : (aggregated?.avgfeelslike_c ?? 0) }}°C</b>
          </div>

          <div class="item">
            <span>{{ t("weatherCard.humidity") }}</span>
            <b>{{ isDay ? current.humidity : (aggregated?.avghumidity ?? 0) }}%</b>
          </div>

          <div class="item">
            <span>{{ t("weatherCard.wind") }}</span>
            <b>{{ isDay ? current.wind_kph : (aggregated?.maxwind_kph ?? 0) }} km/h</b>
          </div>

          <div class="item">
            <span>{{ t("weatherCard.pressure") }}</span>
            <b>{{ isDay ? current.pressure_mb : (aggregated?.pressure_mb ?? 0) }} hPa</b>
          </div>
        </div>

        <button class="favorite-btn" :class="{ active: isFavorite }" @click.stop="onFavoriteClick">
          <Star />
        </button>
      </div>

      <div class="card back">
        <h2 class="forecast-title">
          {{ isDay ? t("weatherCard.hourlyForecast") : t("weatherCard.threeDayForecast") }}
        </h2>

        <div v-if="isDay" class="hourly-list">
          <div v-for="hour in forecastHours" :key="hour.time_epoch" class="hour-item">
            <span class="hour">
              {{ hour.time.split(" ")[1].slice(0, 5) }}
            </span>

            <div class="hour-center">
              <img :src="`https:${hour.condition.icon}`" class="hour-icon" alt="" />
              <span class="condition">{{ hour.condition.text }}</span>
            </div>

            <span class="hour-temp"> {{ Math.round(hour.temp_c) }}° </span>
          </div>
        </div>

        <div v-else class="hourly-list">
          <div v-for="day in forecastData" :key="day.date" class="hour-item">
            <span class="hour">{{ day.date }}</span>

            <div class="hour-center">
              <img :src="`https:${day.day.condition.icon}`" class="hour-icon" alt="" />
              <span class="condition">{{ day.day.condition.text }}</span>
            </div>

            <span class="hour-temp"> {{ Math.round(day.day.avgtemp_c) }}°C </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  position: relative;
  perspective: 1400px;
  transition: transform 0.9s;
  cursor: pointer;
}

.card-wrapper:hover {
  transform: scale(1.02);
}

.card-wrapper.selected .card {
  box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.85),
      0 0 32px rgba(255, 255, 255, 0.25),
      0 10px 40px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

.remove-btn {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 5;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}

.remove-btn svg {
  width: 18px;
  height: 18px;
}

.remove-btn:hover {
  background: rgba(255, 80, 80, 0.7);
  color: #fff;
  transform: scale(1.1);
}

.card-inner {
  position: relative;
  width: 390px;
  height: 560px;
  max-width: 100%;
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

@media (max-width: 1024px) {
  .card-inner {
    width: 340px;
    height: 460px;
  }

  .card {
    padding: 22px;
    border-radius: 26px;
  }

  .head-text {
    margin-top: 10px;
  }

  .city {
    font-size: 24px;
  }

  .desc {
    margin-top: 6px;
    font-size: 14px;
  }

  .icon {
    width: 64px;
    height: 64px;
  }

  .temp {
    margin: 16px 0;
    font-size: 72px;
  }

  .grid {
    gap: 12px;
  }

  .item {
    padding: 12px 10px;
    border-radius: 14px;
  }

  .item span {
    margin-bottom: 6px;
    font-size: 12px;
  }

  .item b {
    font-size: 15px;
  }

  .forecast-title {
    margin-bottom: 14px;
    font-size: 24px;
  }

  .hour-item {
    padding: 8px 12px;
    border-radius: 12px;
  }

  .hour {
    width: 50px;
    font-size: 13px;
  }

  .hour-icon {
    width: 28px;
    height: 28px;
  }

  .condition {
    font-size: 12px;
  }

  .hour-temp {
    font-size: 18px;
  }

  .favorite-btn {
    width: 36px;
    height: 36px;
  }

  .favorite-btn svg {
    width: 24px;
    height: 24px;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    top: 10px;
    left: 10px;
  }

  .remove-btn svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .card-wrapper {
    width: 100%;
    perspective: none;
  }

  .card-wrapper:hover {
    transform: none;
  }

  .card-inner {
    width: 100%;
    max-width: 480px;
    height: auto;
    min-height: 88px;
    transform-style: flat;
    transition: none;
  }

  .card-inner.flipped {
    transform: none;
  }

  .back,
  .grid {
    display: none;
  }

  .card {
    position: relative;
    padding: 14px 16px;
    border-radius: 18px;
    backface-visibility: visible;
  }

  .front {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .top {
    flex: 1;
    min-width: 0;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
  }

  .head-text {
    flex: 1;
    min-width: 0;
    order: 2;
    margin-top: 0;
  }

  .icon {
    order: 1;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }

  .city {
    font-size: 18px;
    line-height: 1.15;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .desc {
    margin-top: 2px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .day-night {
    opacity: 0.8;
  }

  .temp {
    margin: 0;
    font-size: 34px;
    font-weight: 800;
    flex-shrink: 0;
  }

  .favorite-btn {
    margin: 0;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .favorite-btn svg {
    width: 20px;
    height: 20px;
  }

  .remove-btn {
    top: 6px;
    right: 6px;
    left: auto;
    width: 22px;
    height: 22px;
  }

  .remove-btn svg {
    width: 14px;
    height: 14px;
  }

  .card-wrapper.selected .card {
    box-shadow:
        0 0 0 2px rgba(255, 255, 255, 0.85),
        0 6px 18px rgba(0, 0, 0, 0.25);
  }
}

@media (hover: none) {
  .card-wrapper:hover {
    transform: none;
  }

  .item:hover,
  .hour-item:hover {
    transform: none;
  }
}
</style>
