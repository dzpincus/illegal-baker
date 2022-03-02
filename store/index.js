export const state = () => ({
  allImages: [],
})

export const mutations = {
  setImages: (state, images) => (state.allImages = images),
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