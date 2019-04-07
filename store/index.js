import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    pills: [],
    contacts: [],
    aboutPages: [],
    access: false
  },

  mutations: {
    aboutPages(state, item) {
      // console.log(this.app.localePath('index'))
      state.aboutPages = item.sort((a, b) => a.itemsOrder - b.itemsOrder)

    },
    pills(state, item) {

      state.pills = item
    },
    contacts(state, item) {
      state.contacts = item
    },
    access(state, item) {
      state.access = item
    },

  }
})

export default store
