<script setup>
import { ref, onMounted } from "vue"
import { apiRequest } from "@/composables/apiRequest.js"

const props = defineProps({
  city: String
})

const data = ref(null)

onMounted(async () => {
  data.value = await apiRequest(props.city, 1)
})
</script>

<template>
  <div v-if="data" class="small-card">
    <h3 class="city">{{ data.location.name }}</h3>
    <div class="temp">
      {{ Math.round(data.current.temp_c) }}°
    </div>
    <div class="desc">
      {{ data.current.condition.text }}
    </div>
  </div>
</template>

<style scoped>
.small-card {
  width: 160px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.25s ease;
}

.small-card:hover {
  transform: translateY(-6px) scale(1.03);
  background: rgba(255, 255, 255, 0.18);
}

.city {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
  opacity: 0.9;
}

.temp {
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.desc {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.75;
  text-align: center;
}

</style>