<template>
    <h1>{{ loggedInUser }}</h1>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    middleware: "auth",
    computed: {
        ...mapGetters(["loggedInUser"]),
    },
};
</script>
