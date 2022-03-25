<template>
    <b-card no-body class="mb-2 border">
        <b-card-header
            class="p-1 bg-light"
            role="tab"
            v-b-hover="sectionHoverHandler"
        >
            <AdminMenuItemForm
                :menu-item="menuItemToEdit"
                :menu-section="menuSection"
                :tags="tags"
            />
            <b-button
                class="text-left d-flex justify-content-between"
                block
                variant="light"
                @click.prevent="collapseClick"
            >
                <div v-if="editing" class="w-25 d-flex align-items-center">
                    <b-input
                        ref="sectionInput"
                        class="mr-2"
                        v-model="newSectionName"
                    ></b-input>
                    <span
                        @click.stop="saveSectionName"
                        class="isClickable"
                        v-b-tooltip.hover
                        offset="5"
                        title="Save"
                    >
                        <font-awesome-icon
                            icon="floppy-disk"
                        ></font-awesome-icon>
                    </span>
                    <span
                        @click.stop="editing = false"
                        class="isClickable ml-2"
                        v-b-tooltip.hover
                        offset="5"
                        title="Cancel"
                    >
                        <font-awesome-icon icon="x" />
                    </span>
                </div>
                <h3 v-else>{{ menuSection.name }}</h3>
                <div v-if="hover || visible">
                    <span
                        class="isClickable mr-2"
                        v-b-tooltip.hover
                        v-b-tooltip.hover.html="visibleTooltipData"
                        @click.stop="toggleVisibility"
                    >
                        <font-awesome-icon
                            v-if="menuSection.visible"
                            icon="eye"
                        ></font-awesome-icon>
                        <font-awesome-icon
                            v-else
                            icon="eye-slash"
                        ></font-awesome-icon>
                    </span>
                    <span
                        v-if="!menuItems || menuItems.length == 0"
                        class="isClickable mr-2"
                        v-b-tooltip.hover
                        title="Remove section"
                        @click.stop="removeSection"
                    >
                        <font-awesome-icon icon="trash"></font-awesome-icon>
                    </span>
                    <span
                        v-if="!editing"
                        @click.stop="edit"
                        class="isClickable"
                        v-b-tooltip.hover
                        title="Rename"
                    >
                        <font-awesome-icon icon="pencil"></font-awesome-icon>
                    </span>
                    <b-button
                        @click.stop="addNewAdminMenuItem"
                        size="lg"
                        class="ml-2"
                        variant="dark"
                        >Add Item</b-button
                    >
                </div>
            </b-button>
        </b-card-header>
        <b-collapse
            :id="collapseId"
            accordion="section-accordion"
            role="tabpanel"
            v-model="visible"
        >
            <b-card-body>
                <v-draggable class="row" v-model="sortedAdminMenuItems">
                    <AdminMenuItem
                        v-b-hover="itemHoverHandler"
                        @edit="editAdminMenuItem(menuItem)"
                        @delete="deleteAdminMenuItem(menuItem)"
                        v-for="menuItem in sortedAdminMenuItems"
                        class="mt-3 mt-md-0"
                        :key="menuItem.id"
                        :menu-item="menuItem"
                        :tags="tags"
                    />
                </v-draggable>
            </b-card-body>
        </b-collapse>
    </b-card>
</template>

<style scoped>
</style>

<script>
import { mapActions } from "vuex";
export default {
    props: ["menuSection", "menuItems"],
    computed: {
        sortedAdminMenuItems: {
            get: function () {
                return this.menuItems;
            },
            set: function (newOrderObjects) {
                let newOrder = newOrderObjects.map((item) => item.id);
                this.setOrder(newOrder);
            },
        },
        visibleTooltipData: function () {
            let v = this.menuSection.visible ? "Visible" : "Not Visible";
            return {
                title: `${v}</br>(Click to toggle)`,
            };
        },
    },
    data: function () {
        return {
            newSectionName: "",
            hover: false,
            clicked: false,
            visible: false,
            editing: false,
            tags: [
                {
                    value: "vegetarian",
                    title: "Vegetarian",
                    icon: "leaf",
                },
                {
                    value: "vegan",
                    title: "Vegan",
                    icon: "seedling",
                },
                {
                    value: "glutenFree",
                    title: "Gluten Free",
                    icon: "bread-slice",
                },
            ],
            collapseId: `collapse-${this.menuSection.id}`,
            menuItemToEdit: null,
        };
    },
    watch: {
        menuSection: {
            handler: function () {
                this.newSectionName = this.menuSection.name;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        ...mapActions([
            "updateAdminMenuSection",
            "removeAdminMenuItem",
            "removeAdminMenuSection",
        ]),
        edit() {
            this.editing = true;
            this.$nextTick(() => {
                this.$refs.sectionInput.focus();
            });
        },
        async saveSectionName() {
            if (this.newSectionName != this.menuSection.name) {
                let data = { name: this.newSectionName };
                await this.updateAdminMenuSection({
                    id: this.menuSection.id,
                    data: data,
                });
            }

            this.editing = false;
        },
        async removeSection() {
            if (confirm("Are you sure you want to delete this menu section?")) {
                document.body.style.cursor = "wait";
                await this.removeAdminMenuSection(this.menuSection);
                document.body.style.cursor = "default";
            }
        },
        async toggleVisibility() {
            let newValue = !this.menuSection.visible;
            let data = { visible: newValue };
            await this.updateAdminMenuSection({
                id: this.menuSection.id,
                data: data,
            });
        },
        async setOrder(newOrder) {
            let data = { order: newOrder };

            await this.updateAdminMenuSection({
                id: this.menuSection.id,
                data: data,
            });
        },
        openAdminMenuItemForm() {
            this.$root.$emit(
                "bv::show::modal",
                `add-item-modal-${this.menuSection.id}`
            );
        },
        addNewAdminMenuItem() {
            this.menuItemToEdit = null;
            this.openAdminMenuItemForm();
        },
        editAdminMenuItem(menuItem) {
            this.menuItemToEdit = menuItem;
            this.openAdminMenuItemForm();
        },
        async deleteAdminMenuItem(menuItem) {
            if (confirm("Are you sure you want to delete this menu item?")) {
                document.body.style.cursor = "wait";
                await this.removeAdminMenuItem(menuItem);
                document.body.style.cursor = "default";
            }
        },
        sectionHoverHandler(isHovered) {
            this.hover = isHovered;
        },
        itemHoverHandler(isHovered) {
            if (isHovered) {
                document.body.style.cursor = "move";
            } else {
                document.body.style.cursor = "default";
            }
        },
        collapseClick() {
            if (this.menuItems) {
                this.$root.$emit("bv::toggle::collapse", this.collapseId);
            }
        },
    },
};
</script>
