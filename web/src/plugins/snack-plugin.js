import Vue from "vue"

function getContrastingColor(color) {
  const colorMap = {
    primary: "white",
    secondary: "black",
    accent: "black",
    error: "white",
    info: "white",
    success: "white",
    warning: "black",
  }

  return colorMap[color] || "white"
}

const SnackComponent = Vue.extend({
  data: () => ({
    showSnackbar: false,
    message: "",
    options: {},
  }),
  watch: {
    showSnackbar(value) {
      if (!value) {
        this.$el.remove()
        this.$destroy()
      }
    },
  },
  render(h) {
    const contrastingColor = getContrastingColor(this.options.color)
    return h(
      "v-snackbar",
      {
        props: {
          value: this.showSnackbar,
          ...this.options,
        },
        scopedSlots: {
          action: (props) => {
            return h(
              "v-btn",
              {
                props: {
                  color: contrastingColor,
                  text: true,
                },
                on: {
                  click: () => {
                    this.showSnackbar = false
                  },
                },
                attrs: {
                  ...props.attrs,
                  class: "mr-2",
                },
              },
              ["CLOSE"]
            )
          },
        },
      },
      [this.message]
    )
  },
})

/**
 * @typedef {{
 *   [key: string]: unknown;
 *   color: string;
 * }} SnackOptions
 */

/**
 * @template [PreBakedOptions=any]
 * @typedef {(message: string, options?: PreBakedOptions & SnackOptions) => void} SnackFunction
 */

/**
 * @param {string} message
 * @param {SnackOptions} [options] - Any Vuetify VSnackbar props
 *
 * @returns {SnackFunction & {
 *   success: SnackFunction<{ color: "success"}>,
 *   error: SnackFunction<{ color: "error"}>,
 *   info: SnackFunction<{ color: "info"}>,
 *   warning: SnackFunction<{ color: "warning"}>,
 * }} A snack function with additional helper methods
 *
 * @example
 * const snack = useSnack()
 * snack("Hello world", { color: "success" })
 *
 * @example
 * const snack = useSnack()
 * snack.success("Hello world")
 */
export function useSnack(defaultOptions = { timeout: 4000 }) {
  /**
   * The main snack function
   * @type {SnackFunction}
   */
  const snackFunction = (message, options = {}) => {
    const snackInstance = new SnackComponent({
      data: {
        options: {
          ...defaultOptions,
          ...options,
        },
        message,
        showSnackbar: true,
      },
    })
    snackInstance.$mount()
    const appElement = document.getElementById("app")

    if (appElement) {
      appElement.appendChild(snackInstance.$el)
    } else {
      throw new Error("Could not find app element.")
    }
  }

  ;[
    ["success", { color: "success" }],
    ["error", { color: "error" }],
    ["info", { color: "info" }],
    ["warning", { color: "warning" }],
  ].forEach(([helperMethod, preBakedOptions]) => {
    snackFunction[helperMethod] = (message, options = {}) => {
      snackFunction(message, { ...preBakedOptions, ...options })
    }
  })

  return snackFunction
}

// NOTE: Requires Vuetify to work.
const SnackPlugin = {
  install(VueInstance, defaultOptions) {
    VueInstance.prototype.$snack = useSnack(defaultOptions)
  },
}

export default SnackPlugin
