import Vue from 'vue'
import Cookies from 'js-cookie'

export const state = () => ({
  items: []
})

export const mutations = {
  set: (state, items) => {
    Vue.set(state, "items", items);
  },
  add: (state, item) => {
    state.items.push(item);

    Cookies.set("cart", JSON.stringify(state.items));
  }
}

export const getters = {
  items: (state) => state.items,
  size: (state) => {
    
  }
}

export const actions = {
  add({commit}, item) {
    commit("add", item);
  },
  
}
