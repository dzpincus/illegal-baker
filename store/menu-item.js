import Vue from 'vue'
import { camelToSnake, } from '../utils/case-conversion' 


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
    // Add ordered elements to list
    for (const menuSection of Object.values(rootState['menu-section'].all)) {
      sections[menuSection.id] = []
      menuSection.order.forEach((orderId) => {
        if (orderId in state.all) {
          let menuItem = state.all[orderId];
          if (menuItem.menuSections && menuItem.menuSections.indexOf(menuSection.id) > -1) {
            sections[menuSection.id].push(state.all[orderId]);
            allIdsFound.add(orderId);
          }
        }
      })
    }
    // Add any unordered (newly added) elements to end of list
    for (const menuItem of Object.values(state.all)) {
      if (menuItem && menuItem.menuSections && !allIdsFound.has(menuItem.id)) {
        for (var i = 0; i < menuItem.menuSections.length; i++) {
          let menuItemSectionId = menuItem.menuSections[i];
          sections[menuItemSectionId].push(menuItem);
        }
      }
    }
    return sections;
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
    
    let convertedData = {}

    for (const attribute in data) {
      convertedData[camelToSnake(attribute)] = data[attribute]
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(convertedData));
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
    menuItem[attribute] = data.attributes[attribute] || null;
  });

  if (!menuItem["order"]) {
    menuItem["order"] = Number.MAX_SAFE_INTEGER;
  }

  let image = data.attributes["image"]
  if (image && image.data) {
    menuItem["image"] = image.data.id;
  }

  let menuSections = data.attributes["menu_sections"];
  if (menuSections && menuSections.data.length > 0) {
    menuItem["menuSections"] = menuSections.data.map((x) => x.id)
  } else {
    menuItem["menuSections"] = [];
  }

  return menuItem;
}