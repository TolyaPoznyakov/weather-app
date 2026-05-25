<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { searchCities } from "@/composables/apiRequest.js";
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  searchCity: String
});

const emit = defineEmits(["update:searchCity", "search"]);

const suggestions = ref([]);
const showSuggestions = ref(false);
const loading = ref(false);
const wrapper = ref(null);

let timeout = null;

const updateValue = (e) => {
  const value = e.target.value;
  emit("update:searchCity", value);
  clearTimeout(timeout);
  if (!value) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  timeout = setTimeout(async () => {
    const res = await searchCities(value);
    suggestions.value = Array.isArray(res) ? res : [];
    showSuggestions.value = true;
    loading.value = false;
  }, 300);
};

const selectCity = (city) => {
  emit("update:searchCity", city.name);
  showSuggestions.value = false;
  suggestions.value = [];
  emit("search");
};

const handleClickOutside = (e) => {
  if (wrapper.value && !wrapper.value.contains(e.target)) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="search">
    <div class="input-wrapper" ref="wrapper">
      <input
          :value="searchCity"
          type="text"
          :placeholder="t('search.placeholder')"
          @input="updateValue"
          @keyup.enter="$emit('search')"
          @focus="showSuggestions = true"
      />
      <ul v-if="showSuggestions" class="dropdown">
        <li v-if="loading" class="info">
          {{ t('common.loading') }}
        </li>
        <li
            v-for="city in suggestions"
            :key="city.id || city.name"
            @click="selectCity(city)"
        >
          {{ city.name }}, {{ city.country }}
        </li>
        <li v-if="!loading && !suggestions.length" class="info">
          {{ t('search.noResults') }}
        </li>
      </ul>
    </div>
    <button @click="$emit('search')">
      {{ t('search.button') }}
    </button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
}

.input-wrapper {
  position: relative;
}

.search input {
  width: 500px;
  height: 30px;
  padding: 14px 18px;
  border: none;
  border-radius: 16px;
  outline: none;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 18px;
  font-weight: 800;
  backdrop-filter: blur(10px);
}

.search input::placeholder {
  font-size: 18px;
  color: rgba(255,255,255,0.7);
}

.search button {
  width: 120px;
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 800;
  font-size: 18px;
  transition: 0.25s;
}

.search button:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.7);
}


.dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,0.85);
  border-radius: 12px;
  overflow: hidden;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 10px 12px;
  cursor: pointer;
  color: white;
}

.dropdown li:hover {
  background: rgba(255,255,255,0.1);
}

.info {
  padding: 10px 12px;
  opacity: 0.7;
  cursor: default;
}
</style>