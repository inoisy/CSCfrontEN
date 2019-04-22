// const pkg = require('./package')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const axios = require('axios')
// const nuxti18n = require('nuxt-i18n')
// console.log("TCL: nuxti18n", nuxti18n({
//   locales: [{
//       code: 'en',
//       iso: 'en-US',
//       // file: 'en.js'
//     },
//     {
//       code: 'ru',
//       iso: 'ru-RU',
//       // file: 'ru.js'
//     },
//   ],
//   defaultLocale: 'ru',
// }))
// const i18nExtensions = require('vue-i18n-extensions')
// const path = require('path')
const envUrl = process.env.BASE_URL || "https://docker165641-env-0415307.jelastic.regruhosting.ru"
const baseUrl = envUrl
const imageBaseUrl = process.env.IMAGE_BASE_URL || envUrl //"http://docker165641-env-0415307.jelastic.regruhosting.ru"

module.exports = {
  mode: 'universal',
  env: {
    baseUrl: baseUrl,
    imageBaseUrl: imageBaseUrl,
    formFrom: process.env.FORM_FROM || 'hydroservice24ru@gmail.com',
    formContactTo: process.env.FORM_CONTACT_TO || 's.sharkova@cscpharma.ru',
    formTroubleTo: process.env.FORM_TROUBLE_TO || 's.sharkova@cscpharma.ru',
  },

  /*
   ** Headers of the page
   */
  generate: {
    interval: 300,
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
      const aboutItemsEn = aboutData.map(item => {
        return {
          route: `/en/about/${item.slug}`,


        }
      })
      console.log("TCL: aboutItemsEn", aboutItemsEn)
      const {
        data: formsData
      } = await axios.get(baseUrl + "/forms")
      const formsItems = formsData.map(item => {
        return {
          route: `/catalog/${item.slug}`
        }
      })
      const formsItemsEn = formsData.map(item => {
        return {
          route: `/en/catalog/${item.slug}`,
          lang: 'en'

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
      const vacanciesItemsEn = vacanciesData.map(item => {
        return {
          route: `/en/vacancies/${item.slug}`,
          lang: 'en'
        }
      })
      const staticItems = ['/', '/catalog', '/vacancies', '/contacts']
      const staticItemsEn = ['/en', '/en/catalog', '/en/vacancies', '/en/contacts']
      const staticRoutes = staticItems.map(item => {
        return {
          route: item
        }
      })
      const staticRoutesEn = staticItemsEn.map(item => {
        return {
          route: item
        }
      })
      const routes = [...staticRoutesEn, ...staticRoutes, ...aboutItems, ...aboutItemsEn, ...formsItemsEn, ...formsItems, ...vacanciesItemsEn, ...vacanciesItems]
      console.log("TCL: routes", routes)
      // "http://localhost:8080/forms"
      // const ruRoutes = [...aboutItems, ...formsItems, ...vacanciesItems]
      // console.log("TCL: ruRoutes", ruRoutes)

      // const enRoutes = ruRoutes.map(item => {
      //   item.route = "/en" + item.route
      //   return item
      // })
      // console.log("TCL: enRoutes", enRoutes)
      return routes //[...ruRoutes, ...enRoutes]

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
      // vueI18nLoader: true,
      // Options
      locales: [{
          code: 'en',
          iso: 'en-US',
          // file: 'en.js'
        },
        {
          code: 'ru',
          iso: 'ru-RU',
          // file: 'ru.js'
        },
      ],
      defaultLocale: 'ru',
      // lazy: true,
      // langDir: 'lang/'
    }],
    ['@nuxtjs/component-cache', {
      max: 10000,
      maxAge: 1000 * 60 * 60
    }],
  ],

  sitemap: {
    path: "/sitemap.xml",
    hostname: "https://cscpharma.ru",
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: true,
    // exclude: ["/", "/service", "/category", "/contact", "/info", "/article"],
    routes: async function () {
      const staticItems = ['/', '/catalog', '/vacancies', '/contacts']
      const staticItemsEn = ['/en', '/en/catalog', '/en/vacancies', '/en/contacts']
      // const {
      //   data: aboutData
      // } = await axios.get(baseUrl + "/pages?slug=charity&slug=team&slug=mission&slug=story")
      const aboutData = ["charity", "team", "mission", "story"]
      const aboutItems = aboutData.map(item => {
        return `/about/${item}`

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
      // const staticRoutes = [...staticItems, ...staticItemsEn]
      const routes = [...aboutItems, ...formsItems, ...vacanciesItems]
      // console.log("TCL: routes", routes)
      const routesEn = routes.map(item => '/en' + item)
      // console.log("TCL: routesEn", routesEn)
      const allRoutes = [...staticItems, ...staticItemsEn, ...routes, ...routesEn]
      // console.log("TCL: allRoutes", allRoutes)
      // console.log(routes)
      return allRoutes

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
