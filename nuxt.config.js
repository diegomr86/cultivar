export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Cultivar',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description,
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        hid: 'font-awesome',
        src: 'https://kit.fontawesome.com/2671f33306.js',
        crossorigin: 'anonymous',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/custom.sass'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/global-mixin',
    '~/plugins/persisted-state.js',
    { src: '~/plugins/vue-notification', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/google-analytics',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    [
      'nuxt-twa-module',
      {
        /* module options */
        defaultUrl: 'https://www.cultivarbrasil.com',
        hostName: 'www.cultivarbrasil.com',
        applicationId: 'com.ionicframework.plantai563575',
        launcherName: 'Cultivar',
        versionCode: 6,
        versionName: process.env.npm_package_version,
        statusBarColor: '#009d6b',
        // The sha256Fingerprints by is an array with one SHA-256 key string.
        // But if you have multiple you can add them to the array. More information about the website asociation:
        // https://developer.android.com/training/app-links/verify-site-associations#web-assoc
        sha256Fingerprints: [process.env.FINGERPRINT],
        /* optional */
        /* overwrite default location for icon */
        iconPath: '/static/icon.png',
        /* Overwrite folder where to put .wellknown */
        distFolder: '.nuxt/dist/client',
      },
    ],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/auth-next',
  ],

  bootstrapVue: {
    icons: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'pt-BR',
      name: 'Cultivar Brasil',
      short_name: 'Cultivar',
    },
    meta: {
      ogHost: process.env.BASE_URL,
      ogImage: '/cultivar-cover.png',
    },
    workbox: {
      offlineAnalytics: true,
      offlineStrategy: 'StaleWhileRevalidate',
      runtimeCaching: [
        {
          // You can use a RegExp as the pattern:
          urlPattern: 'https://kit.fontawesome.com/.*',
          handler: 'StaleWhileRevalidate',
        },
      ],
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    liveEdit: false,
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          type: 'Token',
        },
        user: {
          property: false,
          // autoFetch: true
        },
        endpoints: {
          login: {
            url: '/login',
            method: 'post',
          },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/me', method: 'get' },
        },
      },
    },
    scope: 'role',
  },
  googleAnalytics: {
    id: 'UA-190127946-1',
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
