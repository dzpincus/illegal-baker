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
            <AdminMenuSection
                v-for="menuSection in sortedAdminMenuSections"
                :menu-section="menuSection"
                :key="menuSection.id"
                :menu-items="menuItemsBySection[menuSection.id]"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    data: function () {
        return {
            newSectionName: "",
            menuItemsBySection: {},
        };
    },
    mounted() {
        this.divideAdminMenuItems();
    },
    methods: {
        ...mapActions[
            ("getAdminMenuSections", "addAdminMenuSection", "getAdminMenuItems")
        ],
        async handleSubmitNewSection() {
            await this.$store.dispatch(
                "addAdminMenuSection",
                this.newSectionName
            );
            this.newSectionName = "";
        },
        divideAdminMenuItems: function () {
            let sections = {};
            if (this.menuItems) {
                for (const menuItem of Object.values(this.menuItems)) {
                    let sectionId = menuItem.menuSection;
                    if (!sections[sectionId]) {
                        sections[sectionId] = {};
                    }
                    sections[sectionId][menuItem.id] = menuItem;
                }
                this.menuItemsBySection = sections;
            }
        },
    },
    computed: {
        ...mapState(["menuItems", "menuSections"]),
        sortedAdminMenuSections: function () {
            if (this.menuSections) {
                let copy = Object.values(
                    JSON.parse(JSON.stringify(this.menuSections))
                );
                copy.sort((a, b) => (a.name > b.name ? 1 : -1));
                return copy;
            }
            return [];
        },
    },
    watch: {
        menuItems: {
            handler: function () {
                this.divideAdminMenuItems();
            },
            deep: true,
        },
    },
};
</script>