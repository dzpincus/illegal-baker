import Vue from 'vue'

export const state = () => ({
  allImages: {},
  menuSections: {},
  menuItems: {},
});

export const mutations = {
  setImages: (state, images) => (state.allImages = images),
  addImage: (state, image) => Vue.set(state.allImages, image.id, image),
  removeImage: (state, imageId) => Vue.delete(state.allImages, imageId),
  setMenuSections: (state, menuSections) =>
    (state.menuSections = menuSections),
  addMenuSection: (state, menuSection) =>
    Vue.set(state.menuSections, menuSection.id, menuSection),
  setMenuItems: (state, menuItems) =>
    (state.menuItems = menuItems),
  addMenuItem: (state, menuItem) =>
    Vue.set(state.menuItems, menuItem.id, menuItem),
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

export const actions = {
  async getImages({
    commit
  }) {
    return await this.$axios
      .get("/images?populate[0]=image")
      .then((res) => {
        let data = {};
        res.data.data.forEach((element) => {
          let image = makeImage(element);
          data[image.id] = image
        });
        commit("setImages", data);
      });
  },
  async addImage({
    commit
  }, fileForm) {
    const formData = new FormData();
    formData.append("files.image", fileForm.newImage, fileForm.newImageName);
    formData.append(
      "data",
      JSON.stringify({
        name: fileForm.newImageName
      })
    );
    let res = await this.$axios
      .post("/images", formData)
      .then((res) => {
        this.$axios
          .get(`/images/${res.data.data.id}?populate[0]=image`)
          .then((newImageRes) => {
            commit(
              "addImage",
              makeImage(newImageRes.data.data)
            );
          });
        return true;
      })
      .catch((e) => {
        return false;
      });
    return res
  },
  async removeImage({
    commit
  }, image) {
    await this.$axios.delete(`/upload/files/${image.imageId}`);
    await this.$axios.delete(`/images/${image.id}`);
    commit("removeImage", image.id);
  },
  async getMenuSections({
    commit
  }) {
    return await this.$axios.get("/menu-sections").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuSection = makeMenuSection(element);
        data[menuSection.id] = menuSection
      });
      commit("setMenuSections", res.data.data);
    });
  },
  async addMenuSection({
    commit
  }, sectionName) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      name: sectionName
    }));
    return await this.$axios
      .post("/menu-sections", formData)
      .then((res) => {
        commit("addMenuSection", makeMenuSection(res.data.data));
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
  async getMenuItems({
    commit
  }) {
    return await this.$axios.get("/menu-items?populate=%2A").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuItem = makeMenuItem(element);
        data[menuItem.id] = menuItem
      });
      commit("setMenuItems", res.data.data);
    });
  },
  async addMenuItem({
    commit
  }, itemName) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      name: itemName
    }));
    return await this.$axios
      .post("/menu-items", formData)
      .then((res) => {
        commit("addMenuItem", makeMenuItem(res.data.data));
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
};

function makeImage(data) {
  // id is image object id
  // imageId is image file id in meida library (only needed for full deletion)
  let image = {
    id: data.id,
    name: data.attributes.name,
    imageId: data.attributes.image.data.id
  };
  let formats = data.attributes.image.data.attributes.formats;
  let urls = parseImageFormats(formats);
  Object.assign(image, urls);
  return image;
}

function makeMenuSection(data) {
  return {
    id: data.id,
    name: data.attributes.name
  }
}

function makeMenuItem(data) {
  let menuItem = {
    id: data.id,
    name: data.attributes.name,
    menuSection: data.attributes.menu_section.data.id,
  }
  let imageData = data.attributes.image.data;
  if (imageData) {
    menuItem[image] = imageData.id
  }
  return menuItem;
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
