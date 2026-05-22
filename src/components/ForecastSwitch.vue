<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "day"
  }
});

const emit = defineEmits(["update:modelValue"]);

const setMode = (mode) => {
  emit("update:modelValue", mode);
};
</script>

<template>
  <div class="mode-switch">
    <button
        :class="{ active: modelValue === 'day' }"
        @click="setMode('day')"
    >
      Today
    </button>
    <button
        :class="{ active: modelValue === '3days' }"
        @click="setMode('3days')"
    >
      3 Days
    </button>
  </div>
</template>

<style scoped>
.mode-switch {
  display: flex;
  gap: 16px;
  padding: 8px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
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
}

.mode-switch button.active {
  background: rgba(255, 255, 255, 0.8);
  color: #000;
}
</style>

