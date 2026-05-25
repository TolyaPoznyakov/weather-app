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
import { useI18n } from "vue-i18n";
import BaseModal from "@/components/BaseModal.vue";

const { t } = useI18n();

const data = ref(null);
const searchCity = ref("");
const forecastMode = ref("day");
const currentPage = ref("weather");
const favorites = ref([]);
const errorMessage = ref("");


const fetchWeather = async (city) => {
  try {
    errorMessage.value = "";
    const response = await apiRequest(city, 3);
    if (!response || response.error) {
      data.value = null;
      errorMessage.value = t('common.cityNotFound');
      return;
    }
    data.value = response;
  } catch (error) {
    data.value = null;
    errorMessage.value = t('common.cityNotFound');
  }
};

const backgroundStyle = computed(() => ({
  background: getWeatherBackground(
      data.value?.current?.condition?.code,
      data.value?.current?.is_day,
  ),
}));

const loadFavorites = () => {
  favorites.value =
      JSON.parse(localStorage.getItem("favorites")) || [];
};

onMounted(async () => {
  data.value = await apiRequest("auto:ip", 3);
  searchCity.value = data.value.location.name;

  loadFavorites();
});
</script>

<template>
  <div class="page" :style="backgroundStyle">
    <div class="weather-title-lang">
      <NavBar
          :currentPage="currentPage"
          @update:currentPage="currentPage = $event"
      />
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
              :data="favorite"
              :mode="forecastMode"
              @favorites-updated="loadFavorites"
          />
        </TransitionGroup>
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
        <div v-if="data" class="weather-block">
          <WeatherCard  :data="data"
                        :mode="forecastMode"
                        @favorites-updated="loadFavorites" />
          <WeatherChart :forecast="data.forecast" :mode="forecastMode" />
        </div>
        <div v-else-if="errorMessage" class="loading">
          {{ errorMessage }}
        </div>
        <div v-else class="loading">
          {{ t("common.loading") }}
        </div>
      </div>
    </div>
    <BaseModal/>
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
  gap: 20px;
  align-items: stretch;
}

.favorite-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 1200px) {
  .weather-block {
    flex-direction: column;
  }
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
    flex-direction: column;
    gap: 18px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 14px;
  }

  .weather-block {
    gap: 0;
  }

  .weather-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .favorite-list {
    gap: 12px;
  }
}
</style>
