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
  },
  updateData: (state, payload) => {
    for (const [key, value] of Object.entries(payload.data)) {
      Vue.set(state.data[payload.id], key, value)
    }
  }
}

export const getters = {
  data: (state) => state.data
}

export const actions = {
  async get({
    commit
  }) {
    await this.$axios.get("orders?populate=%2A").then((res) => {
      let data = {}
      res.data.data.forEach((order) => {
        order['attributes']['createdAt'] = new Date(order['attributes']['createdAt'])
        data[order['id']] = order['attributes']
        data[order['id']]['id'] = order['id']
      })
      commit ("setAll", data)
    })
  },
  setAll({
    commit
  }, items) {
    commit("setAll", items);
  },
  async set({
    commit
  }, data) {
    let convertedData = {}
    for (const attribute in data) {
      convertedData[camelToSnake(attribute)] = data[attribute]
    }
    convertedData['status'] = 'new'
    const formData = new FormData();
    formData.append("data", JSON.stringify(convertedData));
    return await this.$axios.post("/orders", formData)
    .then((res) => {
      let id = res.data.data.id;
      data["id"] = id;
      commit("set", data);
    })

  },
  async update({
    commit
  }, {id, data}) {
    let convertedData = {}
    for (const attribute in data) {
      convertedData[camelToSnake(attribute)] = data[attribute]
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(convertedData));
    await this.$axios.put(`/orders/${id}`, formData).then((res) => {
      commit("updateData", {id, data})
    })
  },
}