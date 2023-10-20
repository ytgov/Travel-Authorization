import VueI18n from "vue-i18n"
import en from "@/locales/en"

function createI18n(VueInstance) {
  VueInstance.use(VueI18n)

  const i18n = new VueI18n({
    // silentTranslationWarn: true,
    locale: "en",
    messages: {
      en,
    },
  })

  return i18n
}

export default createI18n
