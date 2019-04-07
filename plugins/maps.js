import Vue from "vue";
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps/src/main";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDcwwWB8C3wutosvxYlFINCpDDg2Q4lXpk",
    v: "3.exp",
    libraries: "places" // Only if you need Autocomplete
  }
});
