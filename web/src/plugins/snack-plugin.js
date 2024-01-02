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

export function useSnack(defaultOptions = { timeout: 4000 }) {
  return (message, options = {}) => {
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
}

// NOTE: Requires Vuetify to work.
const SnackPlugin = {
  install(VueInstance, defaultOptions) {
    VueInstance.prototype.$snack = useSnack(defaultOptions)
  },
}

export default SnackPlugin
