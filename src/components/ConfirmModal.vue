<script setup>
import { useModal } from "@/composables/useModal"

const modal = useModal()
</script>

<template>
  <div v-if="modal.state.isOpen" class="overlay">
    <div class="modal">
      <h2>{{ modal.state.message }}</h2>

      <div class="actions">
        <button @click="modal.confirmNo">Cancel</button>
        <button @click="modal.confirmYes">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 320px;
  padding: 24px;
  border-radius: 20px;
  background: white;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.actions button {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.actions button:first-child {
  background: #e5e5e5;
  color: #333;
}

.actions button:first-child:hover {
  background: #d6d6d6;
}

.actions button:last-child {
  background: #ff4b4b;
  color: white;
}

.actions button:last-child:hover {
  background: #e63b3b;
}
</style>