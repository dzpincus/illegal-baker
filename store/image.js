import Vue from 'vue'

export const state = () => ({
  all: {},

})

export const mutations = {
  setAll: (state, images) => Vue.set(state, "all", images),
  set: (state, image) => Vue.set(state.all, image.id, image),
  updateData: (state, image) => Object.assign(state.all[image.id], image),
  remove: (state, imageId) => Vue.delete(state.all, imageId),
}

export const getters = {
  all: (state) => {
    return state.all
  },

}

export const actions = {
  async get({
    commit
  }) {
    return await this.$axios
      .get("/images?populate[0]=image")
      .then((res) => {
        let data = {};
        res.data.data.forEach((element) => {
          try {
            let image = makeImage(element);
            data[image.id] = image
          } catch (error) {
            console.log(error)
          }
          
        });
        commit("setAll", data);
      });
  },
  async add({
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
              "set",
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
  async update({
    commit,
  }, {
    id,
    data
  }) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    await this.$axios.put(`/images/${id}`, formData).then((res) => {
      let image = makeImage(res.data.data);
      commit("updateData", image);
    })
  },
  async remove({
    commit
  }, image) {
    await this.$axios.delete(`/upload/files/${image.imageId}`);
    await this.$axios.delete(`/images/${image.id}`);
    commit("remove", image.id);
  },
}

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
  image["rotate"] = data.attributes.rotate || 0;
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