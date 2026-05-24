<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  currentPage: String,
});

const emit = defineEmits(["update:currentPage"]);

const setPage = (page) => {
  emit("update:currentPage", page);
};
</script>

<template>
  <div class="weather-title-lang">
    <div class="nav">
      <h1 class="title" @click="setPage('weather')">
        <span class="big-w">{{ t('common.w') }}</span>{{ t('common.eatherForecast') }}
      </h1>
      <span class="title divider">|</span>
      <span
          class="title"
          :class="{ active: currentPage === 'favorite' }"
          @click="setPage('favorite')"
      >
        {{ t('common.favorites') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.weather-title-lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  color: white;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.title.active {
  text-decoration: underline dotted;
}

.divider {
  color: rgba(255, 255, 255, 0.3);
  cursor: default;
  margin-left: 15px;
  margin-right: 15px;
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