<template>
    <div>
        <h2>Menu Sections</h2>
        <b-button variant="dark" v-b-modal.add-section-modal>
            Add New Section
            <font-awesome-icon class="pl-2" icon="plus" />
        </b-button>

        <b-modal
            @ok="handleSubmitNewSection"
            centered
            id="add-section-modal"
            title="Add a new menu section"
        >
            <b-form ref="form">
                <b-form-group label="Name" label-for="name-input">
                    <b-form-input
                        id="name-input"
                        v-model="newSectionName"
                        required
                    ></b-form-input>
                </b-form-group>
            </b-form>

            <template #modal-footer="{ close, ok }">
                <b-button variant="light" @click="close()">Cancel</b-button>
                <b-button
                    :disabled="!newSectionName"
                    type="submit"
                    @click.prevent="ok"
                    variant="primary"
                    >Save
                </b-button>
            </template>
        </b-modal>

        <div class="accordion pt-3" role="tablist">
            
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    data: function () {
        return {
            newSectionName: "",
            menuItemsBySection: null,
        };
    },
    methods: {
        ...mapActions[("getMenuSections", "addMenuSection", "getMenuItems")],
        async handleSubmitNewSection() {
            await this.$store.dispatch("addMenuSection", this.newSectionName);
            this.newSectionName = "";
            let x = 1;
        },
        divideMenuItems: function () {
            let sections = {};
            for (const menuItem of this.menuItems) {
                let sectionId = menuItem.attributes.menu_section.data.id;
                if (sections[sectionId]) {
                    sections[sectionId].push(menuItem);
                } else {
                    sections[sectionId] = [menuItem];
                }
            }
            this.menuItemsBySection = sections;
        },
    },
    computed: {
        ...mapGetters(["menuSections", "menuItems"]),
    },
    watch: {
        menuItems: function () {
            this.divideMenuItems();
        },
    },
    async fetch() {
        await this.$store.dispatch("getMenuSections");
        await this.$store.dispatch("getMenuItems");
        this.divideMenuItems();
    },
};
</script>