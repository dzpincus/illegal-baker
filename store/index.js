import Vue from 'vue'

export const state = () => ({
  allImages: {},
  menuSections: {},
  menuItems: {},
});

export const mutations = {
  addImages: (state, images) => (state.allImages = images),
  addImage: (state, image) => Vue.set(state.allImages, image.id, image),
  updateImageData: (state, image) => Object.assign(state.allImages[image.id], image),
  removeImage: (state, imageId) => Vue.delete(state.allImages, imageId),
  setMenuSections: (state, menuSections) =>
    (state.menuSections = menuSections),
  setMenuSection: (state, menuSection) =>
    Vue.set(state.menuSections, menuSection.id, menuSection),
  setMenuItems: (state, menuItems) =>
    (state.menuItems = menuItems),
  setMenuItem: (state, menuItem) =>
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
  async getMenuSections({
    commit
  }) {
    return await this.$axios.get("/menu-sections").then((res) => {
      let data = {}
      res.data.data.forEach((element) => {
        let menuSection = makeMenuSection(element);
        data[menuSection.id] = menuSection
      });
      commit("setMenuSections", data);
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
        commit("setMenuSection", makeMenuSection(res.data.data));
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
  async updateMenuSection({ commit }, {id, data}) {
    const formData = new FormData();
    debugger;
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/menu-sections/${id}`, formData).then((res) => {
        commit("setMenuSection", makeMenuSection(res.data.data));
    })
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
      commit("setMenuItems", data);
    });
  },
  async addMenuItem({
    commit
  }, data) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    return await this.$axios
      .post("/menu-items", formData)
      .then((res) => {
        this.$axios.get(`/menu-items/${res.data.data.id}?populate=%2A`).then((newItemRes) => {
          commit("setMenuItem", makeMenuItem(newItemRes.data.data));

        });
        return true;
      })
      .catch((e) => {
        return false;
      });
  },
  async updateMenuItem({
    commit,
  }, {
    id,
    data
  }) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/menu-items/${id}`, formData).then((res) => {
      this.$axios.get(`/menu-items/${res.data.data.id}?populate=%2A`).then((updatedItemRes) => {
        commit("setMenuItem", makeMenuItem(updatedItemRes.data.data));

      });
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
    var urls = parseImageFormats(formats);
  }
  Object.assign(image, urls);
  return image;
}

function makeMenuSection(data) {
  return {
    id: data.id,
    name: data.attributes.name,
    visible: data.attributes.visible,
    order: data.attributes.order ?? []
  }
}

function makeMenuItem(data) {
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