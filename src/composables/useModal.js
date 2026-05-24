import { reactive } from "vue"

const state = reactive({
    isOpen: false,
    message: "",
    resolve: null,
})

export function useModal() {

    const confirm = (message) => {
        state.isOpen = true
        state.message = message
        return new Promise((resolve) => {
            state.resolve = resolve
        })
    }

    const confirmYes = () => {
        state.isOpen = false
        state.resolve?.(true)
        state.resolve = null
    }

    const confirmNo = () => {
        state.isOpen = false
        state.resolve?.(false)
        state.resolve = null
    }

    return {
        state,
        confirm,
        confirmYes,
        confirmNo,
    }
}