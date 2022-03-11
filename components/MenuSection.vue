<template>
    <b-card no-body class="mb-2 border">
        <b-card-header class="p-1 bg-light" role="tab" v-b-hover="hoverHandler">
            <b-modal
                centered
                size="xl"
                :id="`add-item-modal-${menuSection.id}`"
                :title="`Add a new menu item to ${menuSection.attributes.name} section`"
            >
                <b-form ref="form">
                    <b-button
                        v-b-modal="`photo-gallery-modal-${menuSection.id}`"
                    ></b-button>

                    <b-form-group label="Name" label-for="name-input">
                        <b-form-input
                            id="name-input"
                            v-model="newItem.Name"
                            required
                        ></b-form-input>
                    </b-form-group>
                </b-form>

                <template #modal-footer="{ close, ok }">
                    <b-button variant="light" @click="close()">Cancel</b-button>
                    <b-button
                        :disabled="!newItem.Name"
                        type="submit"
                        @click.prevent="ok"
                        variant="primary"
                        >Save
                    </b-button>
                </template>
            </b-modal>

            <b-modal
                :id="`photo-gallery-modal-${menuSection.id}`"
                size="xl"
                header-class="d-none"
            >
                <PhotoGallery :selecting="true" />
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
            <b-button
                class="text-left d-flex justify-content-between"
                block
                variant="light"
                @click.prevent="collapseClick"
            >
                <h3>{{ menuSection.attributes.name }}</h3>
                <b-button
                    v-b-modal="`add-item-modal-${menuSection.id}`"
                    v-if="hover"
                    size="lg"
                    variant="dark"
                    >Add Item</b-button
                >
            </b-button>
        </b-card-header>
        <b-collapse
            :id="collapseId"
            accordion="section-accordion"
            role="tabpanel"
        >
            <b-card-body>
                <b-card-text>
                    {{ menuItems }}
                </b-card-text>
            </b-card-body>
        </b-collapse>
    </b-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: ["menuSection", "menuItems"],
    data: function () {
        return {
            hover: false,
            clicked: false,

            collapseId: `collapse-${this.menuSection.id}`,
            newItem: {
                name: "",
            },
        };
    },
    methods: {
        hoverHandler(isHovered) {
            this.hover = isHovered;
        },
        collapseClick() {
            this.$root.$emit("bv::toggle::collapse", this.collapseId);
        },
        addClick() {
            // this.clicked = true;
        },
    },
};
</script>
