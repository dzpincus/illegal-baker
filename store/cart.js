import Vue from 'vue'
import Cookies from 'js-cookie'

export const state = () => ({
  items: {}
})

export const mutations = {
  setAll: (state, items) => {
    state.items = items || {};
  },
  set: (state, item) => {
    Vue.set(state.items, item.id, item)
    Cookies.set("cart", JSON.stringify(state.items));
  },

  updateData: (state, payload) => {
    for (const [key, value] of Object.entries(payload.data)) {
      Vue.set(state.items[payload.id], key, value)
    }
    Cookies.set("cart", JSON.stringify(state.items));

  },
  remove: (state, itemId) => Vue.delete(state.items, itemId)
}

export const getters = {
  items: (state) => state.items,
  size: (state) => {
    let size = Object.values(state.items).reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    return size > 0 ? size : "";
  },
  total: (state) => {
    let total = Object.values(state.items).reduce((acc, item) => {
      return acc + (item.quantity * item.price);
    }, 0);
    return total
  }
}

export const actions = {
  setAll({
    commit
  }, items) {
    commit("setAll", items);
  },
  add({
    commit
  }, item) {
    commit("set", item);
  },
  update({
    commit
  }, payload) {
    commit("updateData", payload);
  },
  remove({
    commit
  }, itemId) {
    commit("remove", itemId);
  }

}