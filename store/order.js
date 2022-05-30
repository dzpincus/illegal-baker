import Vue from 'vue'

export const state = () => ({
  data: {}
})

export const mutations = {
  set: (state, data) => {

    for (const [key, value] of Object.entries(data)) {
      Vue.set(state.data, key, value)
    }
    debugger;

  }
}

export const getters = {
  data: (state) => state.data
}

export const actions = {
  set({
    commit
  }, data) {
    commit("set", data);
  }
}