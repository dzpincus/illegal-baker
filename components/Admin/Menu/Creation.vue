<template>
    <div>
        <AdminMenuMoveItemForm ref="move_item_form" :menuSections="sortedMenuSections"/>
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
                v-for="menuSection in sortedMenuSections"
                :menu-section="menuSection"
                :key="menuSection.id"
                :menu-items="menuItemsBySection[menuSection.id]"
                @moveItem="moveItem"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data: function () {
        return {
            newSectionName: "",
        };
    },
    methods: {
        async handleSubmitNewSection() {
            await this.$store.dispatch("menu-section/add", this.newSectionName);
            this.newSectionName = "";
        },
        moveItem(item) {
            this.$refs.move_item_form.show(item);
        }
    },
    computed: {
        ...mapGetters({
            menuItems: "menu-item/all",
            menuItemsBySection: "menu-item/bySection",
            menuSections: "menu-section/all",
        }),
        sortedMenuSections: function () {
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
};
</script>