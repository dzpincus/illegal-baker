require("dotenv").config();
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',
  // mode: 'spa',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Illegal Baker',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/style.scss'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/google-fonts'
  ],

  plugins: ['~/plugins/vuedraggable.js', { src: '~/plugins/vue-resize-text.js', mode: 'client' }],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '@nuxt/image', '@nuxtjs/auth-next', '@nuxtjs/fontawesome'],
  auth: {
    strategies: {
      local: {
        token: {
          property: 'jwt',
        },
        user: {
          property: false
        },
        autoFetch: true,
        endpoints: {
          login: {
            url: `${process.env.API_AUTH_URL}/auth/local`,
            method: 'post',
            property: 'jwt'
          },
          user: {
            url: `${process.env.API_AUTH_URL}/users/me`,
            method: 'get',
            autoFetch: true,
          },
          logout: false
        },
      }
    }
  },
  axios: {
    baseURL: process.env.API_AUTH_URL
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },
  fontawesome: {
    icons: {
      solid: ['faFloppyDisk', 'faPencil', 'faUpload', 'faTrash', 'faPlus', 'faMinus', 'faLeaf', 'faSeedling', 'faCamera', 'faCircle', 'faBreadSlice', 'faSlash', "faCircleInfo", "faEye", "faEyeSlash", "faX", "faBagShopping"],
    }
  },
  googleFonts: {
    families: {
      'Brygada+1918': true
    }
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dhsx84kmu/image/fetch/'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.node = {
        fs: "empty",
        child_process: "empty"
      };
    }
  },

  env: {
    baseUrl: process.env.API_AUTH_URL,
    strapiAppToken: process.env.STRAPI_APP_TOKEN,
    googlePlacesKey: process.env.GOOGLE_MAPS_KEY,
    stripeKey: process.env.STRIPE_KEY
  },
  publicRuntimeConfig: {
    baseUrl: process.env.API_AUTH_URL
  }
}