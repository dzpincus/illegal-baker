<template>
    <div
        @click.stop="$emit('addItem')"
        v-b-hover="hoverHandler"
        :class="{ hovered: hovered }"
        class="
            isClickable
            d-flex
            flex-column
            align-items-start
            justify-content-center
        "
    >
        <CloudinaryImage
            class="itemImage"
            :image="image"
            :thumbnail-only="true"
        ></CloudinaryImage>
        <div class="mt-2 w-100 d-flex flex-column h5 itemDescription">
            <span>{{ menuItem.name }}</span>
            <span
                >${{ menuItem.price
                }}<template v-if="hasPriceOption">+</template>
            </span>
        </div>
    </div>
</template>

<style scoped>
.hovered > .itemImage {
    opacity: 50%;
}
.hovered .itemDescription {
    text-decoration: underline;
}
</style>

<script>
import { mapGetters } from "vuex";
export default {
    props: ["menuItem"],
    data: function () {
        return { hovered: false };
    },
    computed: {
        ...mapGetters(["allImages"]),
        image: function () {
            return this.allImages[this.menuItem.image];
        },
        hasPriceOption: function () {
            for (const option in this.menuItem.options) {
                if (option.priceModel != "none") {
                    return true;
                }
            }
            return false;
        },
    },
    methods: {
        hoverHandler(isHovered) {
            this.hovered = isHovered;
        },
    },
};
</script>