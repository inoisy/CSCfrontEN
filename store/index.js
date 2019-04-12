// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// const store = () => new Vuex.Store({

export const state = () => ({
  pills: [],
  contacts: [],
  aboutPages: [],
  access: false,
  locale: {}
})

export const mutations = {
  aboutPages(state, item) {
    state.aboutPages = item
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
  locale(state, item) {
    state.locale = item
  }
}
