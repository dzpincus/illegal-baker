<template>
    <div
        class="
            d-flex
            pl-2
            pt-2
            justify-content-between
            align-items-center
            w-100
        "
        v-b-hover="hoverHandler"
        v-if="menuItem"
    >
        <div class="d-flex">
            <CloudinaryImage
                class="mr-2"
                height="75px"
                width="75px"
                style="height: 75px; width 75px !important;"
                :image="image"
                :thumbnail-only="true"
            />
            <div>
                <h5 class="mb-0">
                    {{ menuItem.name }}
                </h5>
                <div
                    v-if="item.specialRequests"
                    class="d-flex align-items-center"
                >
                    <span
                        v-b-tooltip.hover.left
                        :title="item.specialRequests"
                        style="width: 200px"
                        class="overflow-hidden mr-2 small"
                    >
                        {{ item.specialRequests }}
                    </span>
                </div>
                <div
                    v-for="(option, index) in Object.keys(item.options)"
                    :key="`${item.name}-option-${index}`"
                >
                    <template v-if="isArray(item.options[option])">
                        <template v-if="item.options[option].length > 0">
                            {{ option }}
                            <ul>
                                <li v-for="(subOption, subIndex) in item.options[option]" :key="`${subOption}-option-${subIndex}`">
                                    {{ subOption.name }} <template v-if="subOption.price">: (${{ subOption.price }})</template>
                                </li>
                            </ul>
                        </template>
                    </template>
                    <template v-else>
                        {{ option }} : {{ item.options[option].name }} (${{
                            item.options[option].price
                        }})
                    </template>
                </div>
                <span v-if="hovered">
                    <span v-b-tooltip.hover title="Edit">
                        <font-awesome-icon
                            @click="$emit('edit')"
                            size="xs"
                            icon="pencil"
                            class="pr-1 isClickable"
                        ></font-awesome-icon>
                    </span>
                    <span v-b-tooltip.hover title="Remove from cart">
                        <font-awesome-icon
                            @click="remove"
                            size="xs"
                            icon="trash"
                            class="isClickable"
                        ></font-awesome-icon>
                    </span>
                </span>
            </div>
        </div>
        <div class="mr-2 align-self-start d-flex flex-column align-items-end">
            <div class="d-flex align-items-center border border-dark">
                <span
                    class="border-right border-dark px-2"
                    :class="[
                        item.quantity == 1
                            ? 'isDisabled text-warning'
                            : 'isClickable',
                    ]"
                    @click="updateQuantity(-1)"
                >
                    <font-awesome-icon icon="minus" size="1x" />
                </span>
                <span class="px-2">{{ item.quantity }}</span>
                <span
                    class="border-left border-dark px-2 isClickable"
                    @click="updateQuantity(1)"
                >
                    <font-awesome-icon icon="plus" size="1x" />
                </span>
            </div>
            <h5 class="pt-2">${{ item.price * item.quantity }}</h5>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: function () {
        return {
            optionsId: `option-${this.item.id}`,
            optionsVisible: false,
            hovered: false,
        };
    },
    computed: {
        ...mapGetters({ menuItems: "menu-item/all", images: "image/all" }),
        item: {
            get() {
                return JSON.parse(JSON.stringify(this.cartItem));
            },
            cache: false,
        },
        menuItem() {
            if (Object.keys(this.menuItems).length) {
                const menuItem = this.menuItems[this.item.menuItem];
                if (menuItem) {
                    return menuItem
                } else {
                    this.$store.dispatch("cart/remove", this.item.id);
                }
            }
        },
        image() {
            if (this.menuItem) {
                return this.images[this.menuItem.image];
            }
        },
    },
    methods: {
        isArray(option) {
            return option instanceof Array
        },
        hoverHandler(isHovered) {
            this.hovered = isHovered;
        },
        updateQuantity(value) {
            if (!(this.item.quantity == 1 && value == -1)) {
                let payload = {
                    id: this.item.id,
                    data: {
                        quantity: this.item.quantity + value,
                    },
                };
                this.$store.dispatch("cart/update", payload);
            }
        },
        remove() {
            this.$store.dispatch("cart/remove", this.item.id);
        },
    },
    props: ["cartItem"],
};
</script>