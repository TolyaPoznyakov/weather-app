<script setup>
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()

const isOpen = ref(false)
const languages = [
  { code: "en", label: "English" },
  { code: "uk", label: "Українська" }
]

const currentLang = computed(() =>
    languages.find(l => l.code === locale.value)
)

const selectLanguage = (code) => {
  locale.value = code
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="lang-switcher">
    <button class="lang-btn" @click="toggle">
      {{ currentLang?.label }}
      <span class="arrow">▾</span>
    </button>
    <div v-if="isOpen" class="dropdown">
      <div
          v-for="lang in languages"
          :key="lang.code"
          class="item"
          :class="{ active: locale === lang.code }"
          @click="selectLanguage(lang.code)"
      >
        {{ lang.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.lang-switcher {
  position: relative;
  display: inline-flex;
  font-family: system-ui, sans-serif;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.arrow {
  font-size: 12px;
  opacity: 0.7;
}

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 120px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
  z-index: 999;
}

.item {
  display: flex;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  color: white;
}

.item:hover {
  background: #333;
}
</style>