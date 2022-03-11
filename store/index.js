export const state = () => ({
  allImages: [],
  menuSections: [],
  menuItems: [],
});

export const mutations = {
  setImages: (state, images) => (state.allImages = images),
  addImage: (state, image) => state.allImages.push(image),
  removeImage: (state, imageId) => {
      const pos = state.allImages.findIndex((el) => el.id === imageId);
      if (pos >= 0) {
          state.allImages.splice(pos, 1);
      }
  },    
  setMenuSections: (state, menuSections) =>
      (state.menuSections = menuSections),
  addMenuSection: (state, menuSection) =>
      state.menuSections.push(menuSection),
    setMenuItems: (state, menuItems) =>
      (state.menuItems = menuItems),
  addMenuItem: (state, menuItem) =>
      state. menuItem.push(menuItem),
};

export const getters = {
  allImages: (state) => state.allImages,
  menuSections: (state) => state.menuSections,
  menuItems: (state) => state.menuItems,
  isAuthenticated(state) {
      return state.auth.loggedIn;
  },

  loggedInUser(state) {
      return state.auth.user;
  },
};

export const actions =  {
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
              commit("addImage", makeImage(res.data[0]));
              return true;
          })
          .catch((e) => {
              return false;
          });
  },
  async removeImage({ commit }, imageId) {
      await this.$axios.delete(`/upload/files/${imageId}`);
      commit("removeImage", imageId);
  },
  async getMenuSections({ commit }) {
      return await this.$axios.get("/menu-sections").then((res) => {
          commit("setMenuSections", res.data.data);
      });
  },
  async addMenuSection({ commit }, sectionName) {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: sectionName }));
      return await this.$axios
          .post("/menu-sections", formData)
          .then((res) => {
              commit("addMenuSection", res.data.data);
              return true;
          })
          .catch((e) => {
              return false;
          });
  },
  async getMenuItems({ commit }) {
        return await this.$axios.get("/menu-items?populate[0]=menu_section").then((res) => {
        commit("setMenuItems", res.data.data);
    });
  },
  async addMenuItem({ commit }, itemName) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ name: itemName }));
    return await this.$axios
        .post("/menu-items", formData)
        .then((res) => {
            commit("addMenuItem", res.data.data);
            return true;
        })
        .catch((e) => {
            return false;
        });
  },
};

function makeImage(data) {
  let image = {
      id: data.id,
      name: data.name,
  };
  let formats = data.formats;
  let urls = parseImageFormats(formats);
  Object.assign(image, urls);
  return image;
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