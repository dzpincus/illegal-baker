<template>
<b-card class="my-4 mr-4 p-0" @click="$emit('clicked')" :body-class="`px-0 ${viewOnly ? 'bg-secondary' : ''}`">
  <template v-if="!viewOnly" #header>
    <div class="d-flex justify-content-between align-items-center">
      <b-input v-if="editing" v-model="newName"> </b-input>
      <span v-else>
        {{ image.name }}
      </span>
      <div v-if="editing" class="float-right">
        <a v-b-tooltip.hover title="Save" class="isClickable pl-2" @click="save">
          <font-awesome-icon icon="floppy-disk" />
        </a>
      </div>
      <div v-else-if="!viewOnly" class="float-right">
        <a v-b-tooltip.hover title="Delete Image" class="isClickable pr-2" @click.stop="deleteImage">
          <font-awesome-icon icon="trash" />
        </a>
        <a v-b-tooltip.hover title="Edit" class="isClickable pr-2" @click="editing = true">
          <font-awesome-icon icon="pencil" />
        </a>
        <a v-b-tooltip.hover title="Rotate" class="isClickable" @click="rotate">
          <font-awesome-icon icon="arrow-rotate-right" />
        </a>
      </div>
    </div>
  </template>
  <b-card-body class="flex-center p-0" >
    <div class="mh-100" v-b-tooltip.hover :title="image.name">
      <CloudinaryImage :image="image" :height="viewOnly ? 400 : null" :width="viewOnly ? 400 : null"/>
    </div>
  </b-card-body>
</b-card>
</template>

<script>
export default {
  props: ["image", "viewOnly"],
  data: function () {
    return {
      newFile: null,
      newName: "",
      editing: false,
    };
  },
  mounted: function () {
    this.newName = this.image.name;
  },
  methods: {
    async save() {
      if (this.newName != this.image.name) {
        document.body.style.cursor = "wait";
        let data = {
          name: this.newName
        };
        await this.$store
          .dispatch("image/update", {
            id: this.image.id,
            data: data,
          })
          .then(() => {
            document.body.style.cursor = "default";
            this.editing = false;
          });
      } else {
        this.editing = false;
      }
    },
    async rotate() {
      document.body.style.cursor = "wait";
      await this.$store.dispatch("image/update", {
        id: this.image.id,
        data: {
          rotate: (this.image.rotate + 90) % 360
        }
      }).finally(() => {
        document.body.style.cursor = "default";
      })
    },
    async deleteImage() {
      if (confirm("Are you sure you want to delete this image?")) {
        document.body.style.cursor = "wait";
        await this.$store.dispatch("image/remove", this.image);
        document.body.style.cursor = "default";
      }
    },
  },
};
</script>
