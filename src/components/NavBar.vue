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
          class="title title-fav"
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
}

.nav {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  color: white;
  font-size: clamp(24px, 5vw, 42px);
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  word-break: break-word;
}

.title.active {
  text-decoration: underline dotted;
}

.divider {
  color: rgba(255, 255, 255, 0.3);
  cursor: default;
  margin-inline: 10px;
}

.big-w {
  font-size: clamp(34px, 7vw, 52px);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2.5px white;
  background: inherit;
  background-clip: text;
  -webkit-background-clip: text;
  display: inline-block;
}

@media (max-width: 768px) {
  .nav {
    width: 100%;
    justify-content: center;
    gap: 8px;
  }

  .title-fav  {
    padding-top: 6px;
  }

  .divider {
    display: none;
  }

}

@media (max-width: 480px) {
  .nav {
    flex-direction: column;
    align-items: center;
  }

  .title-fav  {
    padding: 0;
  }

  .title {
    text-align: center;
  }
}
</style>