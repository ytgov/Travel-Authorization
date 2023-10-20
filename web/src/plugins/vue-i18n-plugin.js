// i18nPlugin.js

import VueI18n from "vue-i18n"
import en from "@/locales/en"

const I18nPlugin = {
  install(VueInstance) {
    VueInstance.use(VueI18n)

    const i18n = new VueI18n({
      locale: "en",
      messages: {
        en,
      },
    })

    return i18n
  },
}

export default I18nPlugin
