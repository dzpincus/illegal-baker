<template>
    <b-card v-if="menuItem" class="col-12 col-md-auto h-100 p-0 mr-3" body-class="p-0">
        <div>
            <CloudinaryImage
                class="text-center"
                :image="image"
                :thumbnail-only="true"
                style="position: relative"
            />
            <div
                class="d-flex justify-content-between w-100"
                style="position: absolute; bottom: 75px; opacity: 60%"
            >
                <span
                    class="isClickable"
                    v-b-tooltip.hover.html="visibleTooltipData"
                    @click="toggleVisibility"
                >
                    <span>
                    <font-awesome-layers
                                class="fa-2x ml-2"
                                full-width
                        >
                            <font-awesome-icon icon="circle" />
                            <font-awesome-icon
                                v-if="menuItem.visible"
                                class="text-white"
                                transform="shrink-6"
                                icon="eye"
                                style="left: -3px"
                            ></font-awesome-icon>
                            <font-awesome-icon
                                v-else
                                class="text-white"
                                transform="shrink-6"
                                icon="eye-slash"
                                style="left: -3px"
                            ></font-awesome-icon>
                    </font-awesome-layers>
                    </span>
                    
                </span>
                <div>
                    <template v-for="tag in tags">
                        <span
                            v-if="menuItem[tag.value]"
                            :key="`${tag.value}-${menuItem.id}`"
                        >
                            <font-awesome-layers
                                v-b-tooltip.hover
                                :title="tag.title"
                                class="fa-2x mr-2"
                                full-width
                            >
                                <font-awesome-icon icon="circle" />
                                <font-awesome-icon
                                    class="text-white"
                                    transform="shrink-6"
                                    :icon="tag.icon"
                                ></font-awesome-icon>
                            </font-awesome-layers>
                        </span>
                    </template>
                </div>
            </div>
        </div>
        <template #footer>
            <div v-b-hover="hoverHandler">
                <span>{{ menuItem.name }}</span>
                <a
                    class="float-right isClickable"
                    v-b-tooltip.hover
                    title="Edit"
                    v-if="isHovered"
                    @click="$emit('edit')"
                >
                    <font-awesome-icon icon="pencil"></font-awesome-icon>
                </a>
                <a
                    class="float-right isClickable mr-3"
                    v-b-tooltip.hover
                    title="Change Section"
                    v-if="isHovered"
                    @click="$emit('move')"
                >
                    <font-awesome-icon icon="up-down"></font-awesome-icon>
                </a>
                <br />
                <span
                    >${{ menuItem.price
                    }}<template v-if="hasPriceOption">+</template>
                </span>

                <a
                    class="float-right isClickable"
                    v-b-tooltip.hover
                    title="Delete"
                    v-if="isHovered"
                    @click="$emit('delete')"
                >
                    <font-awesome-icon icon="trash"></font-awesome-icon>
                </a>
            </div>
        </template>
    </b-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: ["menuItem", "tags"],
    data: function () {
        return { isHovered: false };
    },
    computed: {
        ...mapGetters({ images: "image/all" }),
        image: function () {
            if (this.menuItem) {
                return this.images[this.menuItem.image];

            }
        },
        hasPriceOption: function () {
            if (this.menuItem) {
                for (const option in this.menuItem.options) {
                    if (option.priceModel != "none") {
                        return true;
                    }
                }
            }
            return false;
        },
        visibleTooltipData: function () {
            let v = this.menuItem.visible ? "Visible" : "Not Visible";
            return {
                title: `${v}</br>(Click to toggle)`,
            };
        },
    },
    methods: {
        hoverHandler(isHovered) {
            this.isHovered = isHovered;
        },
        async toggleVisibility() {
            document.body.style.cursor = "wait";
            let data = { visible: !this.menuItem.visible };
            await this.$store
                .dispatch("menu-item/update", {
                    id: this.menuItem.id,
                    data: data,
                })
                .finally(() => {
                    document.body.style.cursor = "default";
                });
        },
    },
};
</script>