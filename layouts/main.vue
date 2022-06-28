<template>
    <div class="vh-100 d-flex flex-column" style="overflow-y: hidden">
        <PageHeader @height="setHeight" ref="header" class="sticky-top" />
        <CartSidebar :height="height" />
        <transition name="fade">
            <Nuxt class="border-0 overflow-hidden" />
        </transition>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    head() {
        let routeName = "";
        if (this.$nuxt.$route.name != "index") {
            routeName = this.$nuxt.$route.name;
            routeName = routeName[0].toUpperCase() + routeName.slice(1) + " | ";
        }
        return { title: `${routeName}Illegal Baker` };
    },
    mounted() {
        let cart = Cookies.get('cart')
        let order = Cookies.get('order')
        if (cart) {
            this.$store.dispatch('cart/setAll', JSON.parse(cart))
        }
        if (order) {
            this.$store.dispatch('order/setAll', JSON.parse(order))
        }
    },
    data: function () {
        return { height: null };
    },
    methods: {
        setHeight(h) {
            this.height = h;
        },
    },
    async fetch() {
        await this.$store.dispatch("image/get");
        await this.$store.dispatch("homepage/get");
        await this.$store.dispatch("menu-section/get");
        await this.$store.dispatch("menu-item/get");
        await this.$store.dispatch("order-settings/get");
    },
};
</script>
