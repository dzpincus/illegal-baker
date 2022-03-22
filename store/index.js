import Vue from 'vue'

export const state = () => ({
  allImages: {},
  menuSections: {},
  menuItems: {},
  homepage: {}
});

export const mutations = {
  addImages: (state, images) => (state.allImages = images),
  addImage: (state, image) => Vue.set(state.allImages, image.id, image),
  updateImageData: (state, image) => Object.assign(state.allImages[image.id], image),
  removeImage: (state, imageId) => Vue.delete(state.allImages, imageId),
  setAdminMenuSections: (state, menuSections) =>
    (state.menuSections = menuSections),
  setAdminMenuSection: (state, menuSection) =>
    Vue.set(state.menuSections, menuSection.id, menuSection),
  setAdminMenuSectionData: (state, payload) => {
    for (const [key, value] of Object.entries(payload.data)) {
      Vue.set(state.menuSections[payload.id], key, value)
    }
  },
  setAdminMenuItems: (state, menuItems) =>
    (state.menuItems = menuItems),
  setAdminMenuItem: (state, menuItem) =>
    Vue.set(state.menuItems, menuItem.id, menuItem),
  setAdminMenuItemData: (state, payload) => {
    for (const [key, value] of Object.entries(payload.data)) {
      Vue.set(state.menuItems[payload.id], key, value)
    }
  },
  removeAdminMenuItem: (state, menuItemId) => Vue.delete(state.menuItems, menuItemId),
  setHomepage: (state, homepage) => Vue.set(state, "homepage", homepage),
};

export const getters = {
  allImages: (state) => state.allImages,
  menuSections: (state) => state.menuSections,
  menuItems: (state) => state.menuItems,
  homepage: (state) => state.homepage,
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
        commit("addImages", data);
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
  async updateImage({
    commit,
  }, {
    id,
    data
  }) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/images/${id}`, formData).then((res) => {
      let image = makeImage(res.data.data);
      commit("updateImageData", image);
    })
  },
  async removeImage({
    commit
  }, image) {
    await this.$axios.delete(`/upload/files/${image.imageId}`);
    await this.$axios.delete(`/images/${image.id}`);
    commit("removeImage", image.id);
  },
  async getAdminMenuSections({
    commit
  }) {
    return await this.$axios.get("/menu-sections").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuSection = makeAdminMenuSection(element);
        data[menuSection.id] = menuSection
      });
      commit("setAdminMenuSections", data);
    });
  },
  async addAdminMenuSection({
    commit
  }, sectionName) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      name: sectionName
    }));
    return await this.$axios
      .post("/menu-sections", formData)
      .then((res) => {
        commit("setAdminMenuSection", makeAdminMenuSection(res.data.data));
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
  async updateAdminMenuSection({
    commit
  }, {
    id,
    data
  }) {
    commit("setAdminMenuSectionData", {
      id,
      data
    });

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/menu-sections/${id}`, formData).then((res) => {
      commit("setAdminMenuSectionData", {
        id,
        data
      });

      commit("setAdminMenuSection", makeAdminMenuSection(res.data.data));
    })
  },

  async getAdminMenuItems({
    commit
  }) {
    return await this.$axios.get("/menu-items?populate=%2A").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuItem = makeAdminMenuItem(element);
        data[menuItem.id] = menuItem
      });
      commit("setAdminMenuItems", data);
    });
  },
  async addAdminMenuItem({
    commit
  }, data) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    return await this.$axios
      .post("/menu-items", formData)
      .then((res) => {
        this.$axios.get(`/menu-items/${res.data.data.id}?populate=%2A`).then((newItemRes) => {
          commit("setAdminMenuItem", makeAdminMenuItem(newItemRes.data.data));

        });
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
  async updateAdminMenuItem({
    commit,
  }, {
    id,
    data
  }) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/menu-items/${id}`, formData).then((res) => {
      commit("setAdminMenuItemData", {
        id,
        data
      })
    })
  },
  async removeAdminMenuItem({
    commit
  }, menuItem) {
    await this.$axios.delete(`/menu-items/${menuItem.id}`);
    commit("removeAdminMenuItem", menuItem.id);
  },
  async getHomepage({
    commit
  }) {
    await this.$axios.get('/homepage?populate=%2A').then((res) => {
      let attributes = res.data.data.attributes;
      let images = [];
      attributes.images.data.forEach(image => {
        images.push(image.id);
      })
      commit("setHomepage", {announcement: attributes.announcement, mainImage: attributes.main_image.data.id, images: images, colors: attributes.colors})
    })
  },
  async setHomepage({commit}, data) {
    let convertedData = {}
    for (const attribute in data) {
      convertedData[camelToSnake(attribute)] = data[attribute]
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(convertedData));

    await this.$axios.put('/homepage', formData).then(() => {
      commit("setHomepage", {});

      commit("setHomepage", data);
    })
  }
};

function makeImage(data) {
  // id is image object id
  // imageId is image file id in meida library (only needed for full deletion)
  let image = {
    id: data.id,
  };
  if (data.attributes.name) {
    image["name"] = data.attributes.name
  }

  if (data.attributes.image) {
    image["imageId"] = data.attributes.image.data.id
    let formats = data.attributes.image.data.attributes.formats;
    var urls = {};
    if (formats) {
      urls = parseImageFormats(formats);
    } else {
      urls = {
        thumbnail: data.attributes.image.data.attributes.url
      }
    }
  }
  Object.assign(image, urls);
  return image;
}

function makeAdminMenuSection(data) {
  return {
    id: data.id,
    name: data.attributes.name,
    visible: data.attributes.visible,
    order: data.attributes.order ?? []
  }
}

function makeAdminMenuItem(data) {
  let menuItem = {
    id: data.id
  }
  let attributes = ["name", "price", "vegan", "vegetarian", "glutenFree", "visible", "options", "order"];
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

function parseImageFormats(formats) {
  let urlFormats = {};
  ["medium", "small", "thumbnail"].forEach((format) => {
    if (formats.hasOwnProperty(format)) {
      urlFormats[format] = formats[format].url;
    }
  });
  return urlFormats;
}

function snakeToCamel(snakeString) {
  let split = snakeString.split('_');
  if (split.length > 1) {
    let camel = split[0]
    for (var i = 1; i < split.length; i++) {
      let word = split[i];
      word = word[0].toUpperCase() + word.substring(1);
      camel += word;
    }
    return camel;
  } else {
    return snakeString;
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