<script setup>
import { ref } from "vue"
import WeatherCardSmall from "./WeatherCardSmall.vue"
import { useModal } from "@/composables/useModal"

const modal = useModal()
const newCity = ref("")
const cards = ref([
  { id: 1, city: "Kyiv" }
])

const addCard = async () => {
  const city = newCity.value.trim()
  if (!city) return
  if (cards.value.length >= 5) return
  const exists = cards.value.some(
      c => c.city.toLowerCase() === city.toLowerCase()
  )
  if (exists) return
  cards.value.push({
    id: Date.now(),
    city
  })
  newCity.value = ""
}

const deleteCard = async (id) => {
  const ok = await modal.confirm("Delete this city?")
  if (!ok) return
  cards.value = cards.value.filter(c => c.id !== id)
}

const emit = defineEmits(["selectCity"])

const handleClick = (city) => {
  emit("selectCity", city)
}
</script>

<template>
  <div class="weather-list">
    <div class="add-box">
      <input
          v-model="newCity"
          placeholder="Enter city..."
          @keyup.enter="addCard"
      />
      <button @click="addCard">+</button>
    </div>
    <div class="cards">
      <div
          v-for="card in cards"
          :key="card.id"
          class="card-container"
          @click="handleClick(card.city)"
      >
        <WeatherCardSmall :city="card.city" />
        <button
            class="delete-btn"
            @click="deleteCard(card.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 20px;
}

.add-box {
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(255,255,255,0.12);
  padding: 12px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.add-box input {
  width: 220px;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
  color: white;
}

.add-box input::placeholder {
  color: rgba(255,255,255,0.7);
}

.add-box button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: #4f7cff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: filter 0.25s;
}

.add-box button:hover {
  filter: brightness(0.85);
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card-container {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid rgba(255, 80, 80, 0.8);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4b4b;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.delete-btn:hover {
  background: rgba(255, 60, 60, 0.12);
  border-color: rgba(255, 60, 60, 1);
  transform: scale(1.1);
}

.delete-btn:active {
  transform: scale(0.95);
}
</style>