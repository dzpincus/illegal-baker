<template>
    <h1>success</h1>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    layout: "main",
    data: function () {
        return {};
    },
    mounted: function () {
        this.$store.dispatch("cart/setAll", {});
    },
    computed: {
        ...mapGetters({ orderData: "order/data" }),
    },
};
</script>
