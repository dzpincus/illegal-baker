import Vue from 'vue'

export const state = () => ({
  data: {}
})

export const mutations = {
  set: (state, homepage) => Vue.set(state, "data", homepage),

}

export const getters = {
  data: (state) => state.data,

}

export const actions = {
  async get({
    commit
  }) {
    await this.$axios.get('/homepage?populate=%2A').then((res) => {
      let attributes = res.data.data.attributes;
      let images = [];
      attributes.images.data.forEach(image => {
        images.push(image.id);
      })
      commit("set", {
        announcement: attributes.announcement,
        mainImage: attributes.main_image.data.id,
        images: images,
        colors: attributes.colors
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

    await this.$axios.put('/homepage', formData).then(() => {
      commit("set", {});

      commit("set", data);
    })
  }
}

function camelToSnake(camelString) {
  return camelString.split('').map((character) => {
      if (character == character.toUpperCase()) {
        return '_' + character.toLowerCase();
      } else {
        return character;
      }
    })
    .join('');
}