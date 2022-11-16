<template>
    <div class="vh-100 d-flex flex-column" style="overflow-y: hidden">
        <PageHeader @height="setHeight" ref="header" class="sticky-top" />
        <CartSidebar :height="height" />
        <transition name="fade">
            <Nuxt class="border-0 overflow-hidden" />
        </transition>
        <Footer v-if="this.$nuxt.$route.name != 'index'"/>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from "vuex";
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
        cart = cart ? JSON.parse(cart) : null
        order = order ? JSON.parse(order) : null
        if (cart && Object.keys(cart).length) {
            this.$store.dispatch('cart/setAll', cart)
        }
        if (order) {
            this.$store.dispatch('order/setAll', order)
        }
    },
    async updated() {
        if (!this.$store.state.auth.loggedIn && (localStorage.getItem('auth._token.local') !== 'false')) {
            localStorage.clear()
            await this.$auth.logout()
            Cookies.remove('auth._token.local')
        }
        if (!this.images || Object.keys(this.images).length === 0) {
            this.fetchAll();
        }
    },
    data: function () {
        return { height: null };
    },
    computed: {
        ...mapGetters({ images: "image/all" }),
    },
    methods: {
        setHeight(h) {
            this.height = h;
        },
        async fetchAll() {
            let promises = []   
            promises.push(this.$store.dispatch("image/get"));
            promises.push(this.$store.dispatch("homepage/get"));
            promises.push(this.$store.dispatch("menu-section/get"));
            promises.push(this.$store.dispatch("menu-item/get"));
            promises.push(this.$store.dispatch("order-settings/get"));
            if (this.$store.state.auth.loggedIn && this.$nuxt.$route.name != "confirm") {
                promises.push(this.$store.dispatch("order/get"));
            }
            let self = this;
            await Promise.allSettled(promises)
        }
    },
    async fetch() {
        this.fetchAll()
    },
};
</script>
