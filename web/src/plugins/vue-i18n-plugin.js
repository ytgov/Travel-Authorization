import VueI18n from "vue-i18n"
import en from "@/locales/en"

function createI18n(VueInstance) {
  VueInstance.use(VueI18n)

  const i18n = new VueI18n({
    // I can't get VueI18n to detect that the locale is set, even though
    // it shows as set everywhere, so I'm silencing this warning.
    silentTranslationWarn: true,
    locale: "en",
    messages: {
      en,
    },
    // Allows specifying $default as option to $t.
    // Usage: this.$t(`global.phase.${value}`, { $default: "Unknown" })
    // Using $default as this is unlikely to collide with translation interpolation options.
    missing: (_locale, key, _vm, values) => {
      if (values[0] && values[0].$default) {
        return values[0].$default
      }

      return key
    },
  })

  return i18n
}

export default createI18n
