<template>
    <b-card class="h-100 mh-100 container px-0 bg-info shadow" no-body>
        <b-tabs
            class="w-100"
            nav-wrapper-class="text-dark h4 pt-0 px-0"
            active-nav-item-class="bg-info active-border"
            card
            justified
        >
            <b-tab
                v-for="section in displayMenuSections"
                :key="'menuSection-' + section.id"
                title-link-class="text-dark px-5"
                :title="section.name"
                active
            >
            </b-tab>
        </b-tabs>
    </b-card>
</template>


<script>
import { mapState } from "vuex";

export default {
    layout: "main",

    computed: {
        ...mapState(["menuItems", "menuSections"]),
        displayMenuSections() {
            return Object.values(this.menuSections).filter(
                (section) => section.visible
            );
        },
    },
};
</script>