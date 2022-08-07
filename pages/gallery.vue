<template>
<div class="h-100">
  <PhotoGallery :view-only="true" />
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
export default {
  name: "GalleryPage",
  layout: "main",
}
</script>
