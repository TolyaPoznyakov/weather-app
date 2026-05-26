import { createI18n } from "vue-i18n"
import { watch } from "vue"

import uk from "./locales/uk.json"
import en from "./locales/en.json"

const savedLocale = localStorage.getItem("locale")

const i18n = createI18n({
  legacy: false,
  locale: savedLocale || "en",
  fallbackLocale: "en",
  messages: {
    uk,
    en,
  },
})

watch(
  () => i18n.global.locale.value,
  (newLocale) => {
    localStorage.setItem("locale", newLocale)
  }
)

export default i18n
