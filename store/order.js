import Vue from 'vue'
import Cookies from 'js-cookie'
import { camelToSnake } from '../utils/case-conversion' 

export const state = () => ({
  data: {}
})

export const mutations = {
  setAll: (state, data) => {
    state.data = data || {};
  },
  set: (state, data) => {

    for (const [key, value] of Object.entries(data)) {
      Vue.set(state.data, key, value)
    }
    Cookies.set("order", JSON.stringify(state.data));
  }
}

export const getters = {
  data: (state) => state.data
}

export const actions = {
  async set({
    commit
  }, data) {
    let convertedData = {}
    for (const attribute in data) {
      convertedData[camelToSnake(attribute)] = data[attribute]
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(convertedData));
    return await this.$axios.post("/orders", formData)
    .then((res) => {
      commit("set", data);
    })

  }
}