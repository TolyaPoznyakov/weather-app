<script setup>
import { useModal } from "@/composables/useModal";

const modal = useModal();
</script>

<template>
  <Teleport to="body">
    <div v-if="modal.state.isOpen" class="overlay">
      <div class="modal">
        <h2>{{ modal.state.title }}</h2>
        <p>{{ modal.state.message }}</p>
        <button @click="modal.close(true)">
          OK
        </button>
      </div>
    </div>
  </Teleport>
</template>


<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  width: 100%;
  max-width: 380px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  padding: 22px;
  color: #fff;
  font-family: system-ui, sans-serif;
  transform: translateY(10px);
  opacity: 0;
  animation: modalIn 0.15s ease-out forwards;
}

.modal h2 {
  margin: 0 0 5px;
  font-size: 20px;
  font-weight: 800;
}

.modal p {
  margin: 0 0 18px;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
}

.modal button {
  width: 100%;
  padding: 10px 14px;
  margin-top: 10px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #fff;
  color: #000;
  font-weight: 800;
  cursor: pointer;
  transition: none;
}

@keyframes modalIn {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>