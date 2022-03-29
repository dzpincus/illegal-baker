import Vue from 'vue'

import { snakeToCamel } from '../utils/case-conversion' 

export const state = () => ({
  all: {},
})

export const mutations = {
  setAll: (state, menuItems) =>
    (state.all = menuItems),
  set: (state, menuItem) =>
    Vue.set(state.all, menuItem.id, menuItem),
  updateData: (state, payload) => {
    for (const [key, value] of Object.entries(payload.data)) {
      Vue.set(state.all[payload.id], key, value)
    }
  },
  remove: (state, menuItemId) => Vue.delete(state.all, menuItemId),
}

export const getters = {
  all: (state) => state.all,
  bySection: (state, _, rootState) => {
    let sections = {};
    let allIdsFound = new Set();
    if (state.all) {
      // Add ordered elements to list
      for (const menuSection of Object.values(rootState['menu-section'].all)) {
        sections[menuSection.id] = []
        menuSection.order.forEach((orderId) => {
          if (orderId in state.all) {
            sections[menuSection.id].push(state.all[orderId]);
            allIdsFound.add(orderId);
          }
        })
      }
      // Add any unordered (newly added) elements to end of list
      for (const menuItem of Object.values(state.all)) {
        if (!allIdsFound.has(menuItem.id)) {
          sections[menuItem.menuSection].push(menuItem);
        }
      }
      return sections;
    }
  },
}

export const actions = {
  async get({
    commit
  }) {
    return await this.$axios.get("/menu-items?populate=%2A").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuItem = makeMenuItem(element);
        data[menuItem.id] = menuItem
      });
      commit("setAll", data);
    });
  },
  async add({
    commit
  }, data) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    return await this.$axios
      .post("/menu-items", formData)
      .then((res) => {
        this.$axios.get(`/menu-items/${res.data.data.id}?populate=%2A`).then((newItemRes) => {
          commit("set", makeMenuItem(newItemRes.data.data));

        });
        return true;
      })
      .catch((e) => {
        return false;
      });
  },

  async update({
    commit,
  }, {
    id,
    data
  }) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/menu-items/${id}`, formData).then((res) => {
      commit("updateData", {
        id,
        data
      })
    })
  },
  async remove({
    commit
  }, menuItem) {
    await this.$axios.delete(`/menu-items/${menuItem.id}`);
    commit("remove", menuItem.id);
  },
}

function makeMenuItem(data) {
  let menuItem = {
    id: data.id
  }
  let attributes = ["name", "description", "price", "vegan", "vegetarian", "glutenFree", "visible", "options", "order"];
  attributes.forEach((attribute) => {
    if (data.attributes[attribute]) {
      menuItem[attribute] = data.attributes[attribute];
    }
  });

  if (!menuItem["order"]) {
    menuItem["order"] = Number.MAX_SAFE_INTEGER;
  }

  let relationships = ["image", "menu_section"];
  relationships.forEach((relationship) => {
    let rel = data.attributes[relationship];
    if (rel && rel.data) {
      menuItem[snakeToCamel(relationship)] = rel.data.id
    }
  });
  return menuItem;
}

