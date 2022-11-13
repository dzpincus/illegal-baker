<template>
    <div class="d-flex flex-column h-100">
        <div
            v-if="!hideHeader"
            class="
                d-flex
                justify-content-between
                align-items-center
                bg-dark
                text-light
                px-3
            "
            :style="{ height: `${navHeight}px` }"
        >
            <div class="py-4 d-flex align-items-center text-light">
                <font-awesome-icon
                    size="1x"
                    icon="cart-shopping"
                ></font-awesome-icon>
                <h2 class="m-0 pl-2">Cart</h2>
            </div>
            <font-awesome-icon
                @click="$emit('hide')"
                class="isClickable"
                icon="x"
            ></font-awesome-icon>
        </div>
        <CartItem
            @edit="edit(item)"
            v-for="(item, index) in items"
            :key="`cart-${index}`"
            :cart-item="item"
        ></CartItem>
        <OrderAddToCartForm :id="formId" :edit-item="editItem" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: ["formId", "navHeight", "hideHeader"],
    data: function () {
        return { editItem: null };
    },
    computed: {
        ...mapGetters({ items: "cart/items" }),
    },
    methods: {
        edit: function (item) {
            this.editItem = item;
            let self = this;
            setTimeout(function () {
                self.$bvModal.show(self.formId);
            }, 100);
        },
    },
};
</script>