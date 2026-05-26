<script setup>
import { useI18n } from "vue-i18n"
import { CloudSun } from "@lucide/vue"

const { t } = useI18n()

defineProps({
  currentPage: {
    type: String,
    default: "weather",
  },
})

const emit = defineEmits(["update:currentPage"])

const setPage = (page) => {
  emit("update:currentPage", page)
}

const links = [
  { id: "weather", labelKey: "nav.forecast" },
  { id: "favorite", labelKey: "nav.favorites" },
]
</script>

<template>
  <header class="navbar">
    <button class="logo" type="button" :aria-label="t('nav.appName')" @click="setPage('weather')">
      <CloudSun class="logo-icon" aria-hidden="true" />
      <span class="logo-text">{{ t("nav.appName") }}</span>
    </button>

    <nav class="nav-links" :aria-label="t('nav.appName')">
      <button
          v-for="link in links"
          :key="link.id"
          type="button"
          class="nav-link"
          :class="{ active: currentPage === link.id }"
          :aria-current="currentPage === link.id ? 'page' : undefined"
          @click="setPage(link.id)"
      >
        {{ t(link.labelKey) }}
      </button>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: clamp(16px, 4vw, 28px);
  flex-wrap: wrap;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  background: transparent;
  border: 0;
  color: white;
  cursor: pointer;
  font: inherit;
  border-radius: 10px;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.85;
}

.logo:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: 4px;
}

.logo-icon {
  width: 34px;
  height: 34px;
  stroke-width: 2;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
}

.logo-text {
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.nav-link {
  padding: 8px 18px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.25s ease, color 0.25s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.nav-link:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: 2px;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.85);
  color: #111;
}

@media (max-width: 768px) {
  .navbar {
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .nav-link {
    padding: 8px 14px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .logo {
    justify-content: center;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }

  .nav-link {
    flex: 1;
    text-align: center;
  }
}
</style>
