<script setup>
defineProps({
  searchCity: String
});

const emit = defineEmits(["update:searchCity", "search"]);

const updateValue = (e) => {
  emit("update:searchCity", e.target.value);
};
</script>

<template>
  <div class="search">
    <input
        :value="searchCity"
        type="text"
        placeholder="Enter city..."
        @input="updateValue"
        @keyup.enter="$emit('search')"
    />

    <button @click="$emit('search')">
      Search
    </button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
}

.search input {
  width: 260px;
  padding: 14px 18px;
  border: none;
  border-radius: 16px;
  outline: none;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 15px;
  backdrop-filter: blur(10px);
}

.search input::placeholder {
  color: rgba(255,255,255,0.7);
}

.search button {
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s;
}

.search button:hover {
  transform: translateY(-2px);
}
</style>