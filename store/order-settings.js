import Vue from 'vue'
import { camelToSnake, } from '../utils/case-conversion' 

export const state = () => ({
  data: {}
})

export const mutations = {
  set: (state, order_settings) => Vue.set(state, "data", order_settings),
}

export const getters = {
  data: (state) => state.data,
}

export const actions = {
  async get({
    commit
  }) {
    await this.$axios.get('/order-settings?populate=%2A').then((res) => {
      let attributes = res.data.data.attributes;
      commit("set", {
        deliveryLocations: attributes.delivery_locations || [],
        pickupLocations: attributes.pickup_locations || [],
        orderingEnabled: attributes.ordering_enabled,
        disabledOrderingMessage: attributes.disabled_ordering_message
      })
    })
  },
  async set({
    commit
  }, data) {
    let convertedData = {}
    for (const attribute in data) {
      convertedData[camelToSnake(attribute)] = data[attribute]
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(convertedData));

    await this.$axios.put('/order-settings', formData).then(() => {
      commit("set", {});

      commit("set", data);
    })
  }
}