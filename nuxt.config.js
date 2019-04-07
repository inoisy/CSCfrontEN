const pkg = require('./package')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const axios = require('axios')
const i18nExtensions = require('vue-i18n-extensions')
const path = require('path')
const baseUrl = process.env.BASE_URL || "http://localhost:1337" //'https://cscbackend.herokuapp.com'
//"http://localhost:8080" //
// "http://localhost:8080"baseUrl  process.env.BASE_URL + '/graphql'
//  //

module.exports = {
  mode: 'universal',
  env: {
    baseUrl: baseUrl,
    formFrom: process.env.FORM_FROM || 'hydroservice24ru@gmail.com',
    formContactTo: process.env.FORM_CONTACT_TO || 's.sharkova@cscpharma.ru',
    formTroubleTo: process.env.FORM_TROUBLE_TO || 's.sharkova@cscpharma.ru',
  },

  /*
   ** Headers of the page
   */
  generate: {
    // interval: 1000,~
    dir: 'public',
    subFolders: false,
    minify: {
      collapseBooleanAttributes: true,
      collapseWhitespace: false,
      decodeEntities: true,

      processConditionalComments: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      removeTagWhitespace: false,
      sortAttributes: true,
      sortClassName: false,
      trimCustomFragments: true,
      useShortDoctype: true
    },
    routes: async function () {
      const {
        data: aboutData
      } = await axios.get(baseUrl + "/pages?slug=charity&slug=team&slug=mission&slug=story")
      const aboutItems = aboutData.map(item => {
        return {
          route: `/about/${item.slug}`
        }
      })
      const {
        data: formsData
      } = await axios.get(baseUrl + "/forms")
      const formsItems = formsData.map(item => {
        return {
          route: `/catalog/${item.slug}`
        }
      })
      const {
        data: vacanciesData
      } = await axios.get(baseUrl + "/vacancies")
      const vacanciesItems = vacanciesData.map(item => {
        return {
          route: `/vacancies/${item.slug}`
        }
      })
      // "http://localhost:8080/forms"
      return aboutItems.concat(formsItems).concat(vacanciesItems)

    }
  },
  head: {
    title: "CSC Pharma",
    titleTemplate: '%s - CSCPharma',

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
        content: "CSC - это энергично развивающаяся фармацевтическая компания полного цикла, использующая передовые технологии фарминдустрии."
      }
    ],
    script: [{
      src: 'https://polyfill.io/v3/polyfill.min.js?flags=gated%7Calways&rum=true&features=default%2CObject.values%2CMath.cbrt%2CSymbol%2CSymbol.hasInstance%2CSymbol.isConcatSpreadable%2CSymbol.iterator%2CSymbol.match%2CSymbol.replace%2CSymbol.search%2CSymbol.species%2CSymbol.split%2CSymbol.toPrimitive%2CSymbol.toStringTag%2CSymbol.unscopables%2CArray.prototype.findIndex'
    }, ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900&amp;subset=cyrillic'
      }, {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      }

    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/app.styl',
    'aos/dist/aos.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [

    "@/plugins/maps",
    '@/plugins/vuetify',
    {
      src: '~/plugins/swiper.js',
      ssr: false
    },
    {
      src: '~/plugins/particles',
      ssr: false
    },
    {
      src: '@/plugins/aos.js',
      ssr: false
    },
    // {
    //   src: '@/plugins/apollo-fetch.js',
    //   ssr: true
    // },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    "@nuxtjs/sitemap",
    // "@nuxtjs/google-analytics",
    [
      '@nuxtjs/yandex-metrika',
      {
        id: '52601905',
        webvisor: true,
        clickmap: true,
        // useCDN: false,
        trackLinks: true,
        accurateTrackBounce: true,
      }
    ],
    ['nuxt-i18n', {
      vueI18nLoader: true,
      // Options
      locales: [{
          code: 'en',
          iso: 'en-US',
          file: 'en.js'
        },
        {
          code: 'ru',
          iso: 'ru-RU',
          file: 'ru.js'
        },
      ],
      defaultLocale: 'ru',
      lazy: true,
      langDir: 'lang/'
    }],
  ],

  sitemap: {
    path: "/sitemap.xml",
    hostname: "https://hydroservice24.ru",
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: true,
    // exclude: ["/", "/service", "/category", "/contact", "/info", "/article"],
    routes: async function () {
      const {
        data: aboutData
      } = await axios.get(baseUrl + "/pages?slug=charity&slug=team&slug=mission&slug=story")
      const aboutItems = aboutData.map(item => {
        return `/about/${item.slug}`

      })
      const {
        data: formsData
      } = await axios.get(baseUrl + "/forms")
      const formsItems = formsData.map(item => {
        return `/catalog/${item.slug}`

      })
      const {
        data: vacanciesData
      } = await axios.get(baseUrl + "/vacancies")
      const vacanciesItems = vacanciesData.map(item => {
        return `/vacancies/${item.slug}`

      })
      const routes = aboutItems.concat(formsItems).concat(vacanciesItems)
      // console.log(routes)
      return routes

    }
  },

  apollo: {
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    clientConfigs: {
      default: {
        httpEndpoint: baseUrl + '/graphql'
      },
    }
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    publicPath: '/js/',
    // vendor: ["@babel/polyfill"],
    plugins: [
      new VuetifyLoaderPlugin(),
    ],

    transpile: [/^vuetify/, /^aos/, /^vue-awesome-swiper/, /^@nuxtjs\/apollo/, "vue2-google-maps", "vue-particles"],

    /*
     ** You can extend webpack config here
     */
    extend(config) {

    },
  }
}
