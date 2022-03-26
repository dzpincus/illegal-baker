<template>
    <div>
        <b-modal
            centered
            size="xl"
            @ok="handleSubmitformData"
            @close="resetFormData"
            :id="`add-item-modal-${menuSection.id}`"
            :title="formTitle"
        >
            <b-form :ref="`form-${menuSection.id}`" :validated="validated">
                <div class="row">
                    <div class="col-12 col-md-5" v-b-hover="hoverHandler">
                        <b-button
                            v-if="!formData.image"
                            variant="light"
                            class="w-100 h-100 form-control"
                            required
                            v-b-modal="`photo-gallery-modal-${menuSection.id}`"
                        >
                            <font-awesome-icon
                                icon="camera"
                                size="4x"
                                class="w-100"
                            />
                            Choose image
                        </b-button>
                        <b-overlay :no-center="true" :show="imageOverlayShow">
                            <CloudinaryImage
                                v-if="formData.image"
                                :image="formData.image"
                            />

                            <template #overlay>
                                <div class="h-100 flex-center">
                                    <a
                                        class="stretched-link isClickable"
                                        @click="
                                            $root.$emit(
                                                'bv::show::modal',
                                                `photo-gallery-modal-${menuSection.id}`
                                            )
                                        "
                                    >
                                        <font-awesome-icon
                                            icon="camera"
                                            size="4x"
                                            class="w-100"
                                        />
                                    </a>
                                </div>
                            </template>
                        </b-overlay>
                    </div>
                    <div class="col-12 col-md-7">
                        <b-form-group label="Name" label-for="name-input">
                            <b-form-input
                                id="name-input"
                                v-model="formData.name"
                                required
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Price" label-for="price-input">
                            <b-form-input
                                :disabled="disablePriceField"
                                id="price-input"
                                v-model="formData.price"
                                type="number"
                                required
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            label="Description"
                            label-for="description-input"
                        >
                            <b-form-textarea
                                id="textarea"
                                v-model="formData.description"
                                max-rows="6"
                            ></b-form-textarea>
                        </b-form-group>
                        <b-form-group label="Tags">
                            <font-awesome-layers
                                v-for="tag in tags"
                                :key="tag.value"
                                @click.prevent="toggleTag(tag)"
                                class="fa-2x mr-2 isClickable"
                                full-width
                                v-b-tooltip.hover
                                :title="tag.title"
                            >
                                <font-awesome-icon
                                    icon="circle"
                                    :class="{
                                        'text-primary': formData[tag.value],
                                    }"
                                />
                                <font-awesome-icon
                                    :icon="tag.icon"
                                    transform="shrink-6"
                                    :style="{ color: 'white' }"
                                />
                                <font-awesome-icon
                                    :class="{
                                        'text-primary': formData[tag.value],
                                    }"
                                    v-if="tag.value == 'glutenFree'"
                                    icon="slash"
                                    style="font-size: 25px"
                                />
                            </font-awesome-layers>
                        </b-form-group>
                        <b-form-checkbox
                            :validated="false"
                            v-model="formData.visible"
                            :state="null"
                        >
                            Visible to customers
                        </b-form-checkbox>

                        <b-button
                            @click="formData.options.push({})"
                            variant="light"
                            class="mt-3"
                        >
                            <font-awesome-icon icon="plus" /> Add Item Option
                        </b-button>
                    </div>
                </div>
                <div class="w-100 mt-3" v-if="formData.options">
                    <AdminMenuItemOptions
                        class="mt-3"
                        v-model="formData.options[index]"
                        v-for="(option, index) in formData.options"
                        @deleteOption="deleteOption(index)"
                        :key="`option-${index}`"
                        :option-set-index="optionSetIndex"
                        :index="index"
                    />
                </div>
            </b-form>

            <template #modal-footer="{ close, ok }">
                <b-button variant="light" @click="close()">Cancel</b-button>
                <b-button type="submit" @click.prevent="ok" variant="primary"
                    >Save
                </b-button>
            </template>
        </b-modal>

        <b-modal
            :id="`photo-gallery-modal-${menuSection.id}`"
            size="xl"
            header-class="d-none"
        >
            <PhotoGallery selecting="single" v-model="formData.image" />

            <template #modal-footer="{ close, ok }">
                <b-button variant="light" @click="close()">Cancel</b-button>
                <b-button
                    :disabled="!formData.image"
                    type="submit"
                    @click.stop.prevent="ok"
                    variant="primary"
                    >Save
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
export default {
    props: ["menuSection", "tags", "menuItem"],
    data: function () {
        return {
            imageOverlayShow: false,
            validated: false,
            disablePriceField: false,
            formData: {
                name: "",
                price: "",
                description: "",
                image: null,
                visible: false,
                vegan: false,
                vegetarian: false,
                glutenFree: false,
                options: [],
            },
        };
    },
    computed: {
        ...mapGetters({ images: "image/all" }),
        formTitle: function () {
            if (this.menuItem) {
                return "Edit menu item";
            } else {
                return "Add new menu item";
            }
        },
        optionSetIndex: function () {
            for (let [index, option] of this.formData.options.entries()) {
                if (option.priceModel == "set") {
                    return index;
                }
            }
        },
    },
    watch: {
        menuItem: {
            immediate: true,
            handler: function (newVal, oldVal) {
                if (this.menuItem) {
                    Object.assign(
                        this.formData,
                        JSON.parse(JSON.stringify(this.menuItem))
                    );
                    if (this.formData.image) {
                        this.formData.image = this.images[this.formData.image];
                    }
                } else {
                    this.resetFormData();
                }
            },
            deep: true,
        },
        "formData.options": function () {
            if (this.optionSetIndex != null) {
                var minPrice = null;
                let choices =
                    this.formData.options[this.optionSetIndex].choices;
                if (choices) {
                    choices.forEach((choice) => {
                        if (
                            choice.price &&
                            (!minPrice || choice.price < minPrice)
                        ) {
                            minPrice = choice.price;
                        }
                    });
                }
                this.disablePriceField = true;
                this.formData.price = minPrice;
            } else {
                this.disablePriceField = false;
            }
        },
    },
    methods: {
        toggleTag(tag) {
            Vue.set(
                this.formData,
                tag.value,
                !Boolean(this.formData[tag.value])
            );
        },
        hoverHandler(isHovered) {
            if (this.formData.image) {
                this.imageOverlayShow = isHovered;
            }
        },
        resetFormData() {
            this.validated = false;
            this.disablePriceField = false;
            this.formData = {
                name: "",
                price: "",
                description: "",
                image: null,
                visible: false,
                vegan: false,
                vegetarian: false,
                glutenFree: false,
                options: [],
            };
        },
        deleteOption(index) {
            this.formData.options.splice(index, 1);
        },
        async handleSubmitformData(modalEvent) {
            modalEvent.preventDefault();
            const valid =
                this.$refs[`form-${this.menuSection.id}`].checkValidity();
            if (!valid) {
                this.validated = true;
            } else {
                document.body.style.cursor = "wait";

                let data = {
                    name: this.formData.name,
                    price: this.formData.price,
                    description: this.formData.description,
                    visible: this.formData.visible,
                    menu_section: parseInt(this.menuSection.id),
                    vegan: this.formData.vegan,
                    vegetarian: this.formData.vegetarian,
                    glutenFree: this.formData.glutenFree,
                };
                if (this.formData.image) {
                    data["image"] = parseInt(this.formData.image.id);
                }
                data["options"] = this.formData.options;
                if (this.menuItem) {
                    await this.$store
                        .dispatch("menu-item/update", {
                            id: this.menuItem.id,
                            data: data,
                        })
                        .finally(() => {
                            document.body.style.cursor = "default";
                            this.$root.$emit(
                                "bv::hide::modal",
                                `add-item-modal-${this.menuSection.id}`
                            );
                        });
                } else {
                    await this.$store("menu-item/add", data).finally(() => {
                        document.body.style.cursor = "default";
                        this.$root.$emit(
                            "bv::hide::modal",
                            `add-item-modal-${this.menuSection.id}`
                        );
                    });
                }
            }
        },
    },
};
</script>