import { ref, computed, watch } from "vue"
import { isSameLocation } from "@/utils/location"
import { FAVORITES_STORAGE_KEY, MAX_FAVORITES } from "@/utils/constants"

const readFromStorage = () => {
    try {
        const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const favorites = ref(readFromStorage())

watch(
    favorites,
    (value) => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
)

export function useFavorites() {
    const isFavorite = (weather) =>
        favorites.value.some((f) => isSameLocation(f, weather))

    const add = (weather) => {
        if (!weather || isFavorite(weather)) return { ok: false, reason: "exists" }
        if (favorites.value.length >= MAX_FAVORITES) {
            return { ok: false, reason: "limit" }
        }
        favorites.value = [...favorites.value, weather]
        return { ok: true }
    }

    const remove = (weather) => {
        favorites.value = favorites.value.filter((f) => !isSameLocation(f, weather))
    }

    const toggle = (weather) => {
        if (isFavorite(weather)) {
            remove(weather)
            return { ok: true, action: "removed" }
        }
        const result = add(weather)
        return { ...result, action: "added" }
    }

    const update = (weather) => {
        const index = favorites.value.findIndex((f) => isSameLocation(f, weather))
        if (index === -1) return
        const next = favorites.value.slice()
        next.splice(index, 1, weather)
        favorites.value = next
    }

    return {
        favorites: computed(() => favorites.value),
        isFavorite,
        add,
        remove,
        toggle,
        update,
    }
}