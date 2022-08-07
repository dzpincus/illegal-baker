import Vue from 'vue'

export const state = () => ({
  all: {}
})

export const mutations = {
  setAll: (state, menuSections) =>
    (state.all = menuSections),
  set: (state, menuSection) =>
    Vue.set(state.all, menuSection.id, menuSection),
  updateData: (state, payload) => {
    for (const [key, value] of Object.entries(payload.data)) {
      Vue.set(state.all[payload.id], key, value)
    }
  },
  remove: (state, menuSectionId) => Vue.delete(state.all, menuSectionId),
}

export const getters = {
  all: (state) => state.all,

}

export const actions = {
  async get({
    commit
  }) {
    return await this.$axios.get("/menu-sections").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuSection = makeMenuSection(element);
        data[menuSection.id] = menuSection
      });
      commit("setAll", data);
    });
  },
  async add({
    commit
  }, sectionName) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      name: sectionName
    }));
    return await this.$axios
      .post("/menu-sections", formData)
      .then((res) => {
        commit("set", makeMenuSection(res.data.data));
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
  async update({
    commit
  }, {
    id,
    data
  }) {
    commit("updateData", {
      id,
      data
    });

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/menu-sections/${id}`, formData).then((res) => {
      commit("updateData", {
        id,
        data
      });

      commit("set", makeMenuSection(res.data.data));
    })
  },
  async remove({
    commit
  }, menuSection) {
    await this.$axios.delete(`/menu-sections/${menuSection.id}`);
    commit("remove", menuSection.id);
  },
}

function makeMenuSection(data) {
  return {
    id: data.id,
    name: data.attributes.name,
    visible: data.attributes.visible,
    order: data.attributes.order ?? [],
    selfOrder: data.attributes.selfOrder
  }
}