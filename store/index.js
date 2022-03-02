export const state = () => ({
  allImages: [],
  xx: [],
})

export const mutations = {
  setImages: (state, images) => (state.allImages = images),
  setX: (state, images) => (state.xx = images),
  setImage: (state, image) => (state.allImages.push(image)),
  removeImage: (state, imageId) => {
    const pos = state.allImages.findIndex((el) => el.id === imageId);
    if (pos >= 0) {
      state.allImages.splice(pos, 1);
    }
  }
}

export const getters = {
  allImages: (state) => state.allImages,
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
 
  loggedInUser(state) {
    return state.auth.user;
  },
};

export const actions = {
  async getImages({ commit }) {
    return await this.$axios
                .get("/upload/files?populate[0]=image")
                .then((res) => {
                    let data = [];
                    res.data.forEach((element) => {
                        data.push(makeImage(element));
                    });
                    commit("setImages", data);
                });
  },
  async addImage({ commit }, imageFile) {
    const formData = new FormData();
    formData.append("files", imageFile);
    let res = await this.$axios
                .post("/upload", formData)
                .then((res) => {
                    commit('setImage', makeImage(res.data[0]))
                    return true;
                })
                .catch((e) => {
                  return false
                });
  },
  async removeImage({ commit }, imageId) {
    await this.$axios.delete(`/upload/files/${imageId}`)
    commit('removeImage', imageId)

  }
}

function makeImage(data) {
  let image = {
    id: data.id,
    name: data.name,
  };
  let formats = data.formats;
  let urls = parseImageFormats(formats);
  Object.assign(image, urls);
  return image
}

function parseImageFormats(formats) {
  let urlFormats = {};
  ["medium", "small", "thumbnail"].forEach((format) => {
      if (formats.hasOwnProperty(format)) {
          urlFormats[format] = formats[format].url;
      }
  });
  return urlFormats;
}