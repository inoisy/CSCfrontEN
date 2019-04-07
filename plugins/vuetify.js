import Vue from 'vue'
import Vuetify from 'vuetify'
// import colors from 'vuetify/es5/util/colors'
// import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#121212', // a color that is not in the material colors palette
    accent: '#006DF0',
    secondary: "#11333A",
    // info: colors.teal.lighten1,
    // warning: colors.amber.base,
    // error: colors.deepOrange.accent4,
    // success: colors.green.accent3
  },
  options: {
    minifyTheme: function (css) {
      return process.env.NODE_ENV === 'production' ?
        css.replace(/[\s|\r\n|\r|\n]/g, '') :
        css
    }
  }
})
