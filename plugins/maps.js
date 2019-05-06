import Vue from "vue";
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps/src/main";
export default ({
  app
}) => {
  // console.log(app.i18n.locale)
  // console.log("TCL: app.i18n.locale", app.i18n.locale)
  Vue.use(VueGoogleMaps, {
    load: {
      key: process.env.MAPS_API_KEY || "AIzaSyDcwwWB8C3wutosvxYlFINCpDDg2Q4lXpk",
      v: "3.exp",
      //libraries: "places" // Only if you need Autocomplete,
      language: app.i18n.locale,
    }
  });
}
