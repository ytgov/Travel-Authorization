import { getCurrentInstance } from "vue"
import VueI18n from "vue-i18n"
import en from "@/locales/en"

// Please match api in https://vue-i18n.intlify.dev/guide/advanced/composition.html#composition-api
// until we can migrate to Vue 3 and remove this altogether.
export function useI18n() {
  const vm = getCurrentInstance()
  if (vm === null) {
    throw new Error("useI18n must be called within a component setup function.")
  }

  // Expose any i18n properties or methods you need
  // You can add other i18n properties or methods if needed
  return {
    t: vm.proxy.$t.bind(vm.proxy),
    tc: vm.proxy.$tc.bind(vm.proxy),
    te: vm.proxy.$te.bind(vm.proxy),
  }
}

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
