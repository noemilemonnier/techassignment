import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  head: {
    titleTemplate: '%s - Helsinki Services',
    title: 'Helsinki Services',
    noscript: [
      {
        innerHTML:
          'This website requires javascript to run. Please enable it in browser settings.',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/img/logo.png' }
    ]
  },
  loading: {
    color: '#0277bd'
  },
  plugins: [
    '~/plugins/icons',
    '~/plugins/vue2-maps',
    '~/plugins/vue-autocomplete'
  ],
  components: true,
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: { font: false, icons: false },
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: true,
      themes: {
        light: {
          primary: '#72c6f6', // custom blue
          accent: '#b1b1b1', // custom gray
          secondary: '#e8b266', // custom faded orange
          background: '#e3e3e3', // grey lighten-4
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          'color-footer': '#f0f0f0'
        },
        dark: {
          primary: '#7e7e7e', // custom gray
          accent: colors.grey.darken3,
          secondary: '#9c27b0', //custom indigo
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          'color-footer': '#1e1e1e'
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend( config, ctx ){}
  }
}
