<template>
    <div
        @click.stop="$emit('addItem')"
        v-b-hover="hoverHandler"
        :class="{ hovered: hovered }"
        class="
            isClickable
            d-flex
            flex-column
            align-items-md-start align-items-center
            justify-content-center
        "
    >
        <CloudinaryImage
            :image="image"
            :thumbnail-only="true"
        ></CloudinaryImage>
        <div
            class="
                mt-2
                w-100
                d-flex
                align-items-center
                flex-column
                h5
                itemDescription
            "
        >
            <span>{{ menuItem.name }}</span>
            <small>
                <template v-if="hasPriceOption">from</template>
                ${{ menuItem.price }}
            </small>
        </div>
    </div>
</template>

<style scoped>
.hovered > .itemImage {
    opacity: 50% !important;
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
        ...mapGetters({ images: "image/all" }),
        image: function () {
            return this.images[this.menuItem.image];
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