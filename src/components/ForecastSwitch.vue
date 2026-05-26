<script setup>
import { defineEmits, defineProps } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: "day",
  },
})

const emit = defineEmits(["update:modelValue"])

const setMode = (mode) => {
  emit("update:modelValue", mode)
}
</script>

<template>
  <div class="mode-switch">
    <button :class="{ active: modelValue === 'day' }" @click="setMode('day')">
      {{ t("forecast.today") }}
    </button>
    <button :class="{ active: modelValue === '3days' }" @click="setMode('3days')">
      {{ t("forecast.threeDays") }}
    </button>
  </div>
</template>

<style scoped>
.mode-switch {
  display: flex;
  gap: 10px;
  padding: 8px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
}

.mode-switch button {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transition: 0.3s;
  white-space: nowrap;
}

.mode-switch button.active {
  background: rgba(255, 255, 255, 0.8);
  color: #000;
}

@media (max-width: 480px) {
  .mode-switch {
    width: 100%;
  }

  .mode-switch button {
    flex: 1;
    padding: 12px;
    font-size: 14px;
  }
}
</style>
