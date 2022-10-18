<template>
  <b-modal
    :ok-disabled="updatedSections.length === 0"
    @ok="save"
    centered
    title="Update Item Sections"
    size="md"
    ref="modal"
  >
    <b-form-group
      v-if="menuItem"
      label="Choose which sections this item should appear in"
    >
      <b-form-checkbox-group
        v-model="selected"
        :options="options"
        stacked
      ></b-form-checkbox-group>
    </b-form-group>
  </b-modal>
</template>

<script>

export default {
  props: {
    menuSections: Array
  },
  data() {
    return {
      menuItem: null,
      updatedSections: []
    }
  },
  computed: {
    options() {
      return this.menuSections.map((ms) => {
         return {"text": ms.name, "value": ms.id};
        })
    },
    selected: {
      get() {
        return this.menuItem.menuSections;
      },
      set(newValue) {
        this.updatedSections = newValue;
      }
    }
  },
  methods: {
    show(item) {
      this.menuItem = item;
      this.$refs.modal.show();
    },
    async save() {
      let data = JSON.parse(JSON.stringify(this.menuItem));
      data.menuSections = this.updatedSections
      document.body.style.cursor = "wait";
      console.log(data)
      await this.$store.dispatch("menu-item/update", {
        id: this.menuItem.id,
        data: data,
      }).then(() => {
        document.body.style.cursor = "default";
        this.$refs.modal.hide();

      });
      
    }
  }
}

</script>