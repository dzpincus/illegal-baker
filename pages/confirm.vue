<template>
    <div class="h-100 mh-100 container px-0 bg-info shadow">
    </div>
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
