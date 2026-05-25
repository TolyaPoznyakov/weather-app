import { reactive } from "vue";

const state = reactive({
    isOpen: false,
    title: "",
    message: "",
    resolve: null,
    type: "alert",
});

export function useModal() {

    const open = ({ title, message, type = "alert" }) => {
        state.title = title;
        state.message = message;
        state.type = type;
        state.isOpen = true;

        return new Promise((resolve) => {
            state.resolve = resolve;
        });
    };

    const alert = (message, title = "Info") => {
        return open({ title, message, type: "alert" });
    };

    const close = (result = true) => {
        state.isOpen = false;

        if (state.resolve) {
            state.resolve(result);
            state.resolve = null;
        }
    };

    return {
        state,
        alert,
        close,
    };
}