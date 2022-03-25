<template>
    <b-card class="h-100 mh-100 container px-0 bg-info shadow" no-body>
        <b-tabs
            class="w-100 h-100"
            nav-wrapper-class="text-dark h4 pt-0 px-0"
            content-class="pt-0 h-100 pb-5"
            active-nav-item-class="bg-info active-border"
            card
            justified
        >
            <b-tab
                class="p-0"
                v-for="(menuSection, index) in displayMenuSections"
                :key="'menuSection-' + menuSection.id"
                title-link-class="text-dark px-5"
                :title="menuSection.name"
                :active="Boolean(index === 0)"
            >
                <div
                    class="
                        w-100
                        row
                        no-gutters
                        px-2
                        justify-content-md-start justify-content-center
                    "
                >
                    <OrderItem
                        @addItem="addItem(menuItem)"
                        v-for="menuItem in menuItemsBySection[menuSection.id]"
                        :key="menuItem.id"
                        class="col-3 mt-4 pr-2 pl-5"
                        :menu-item="menuItem"
                    >
                    </OrderItem>
                </div>
            </b-tab>
        </b-tabs>
        <OrderAddToCartForm :menu-item="menuItemToAdd" />
    </b-card>
</template>

<style scoped>
.tab-pane {
    overflow-y: scroll;
    height: 100%;
}
</style>


<script>
import { mapGetters } from "vuex";

export default {
    layout: "main",
    data: function () {
        return {
            menuItemToAdd: null,
        };
    },
    async fetch() {
        await this.$store.dispatch("getImages");
        await this.$store.dispatch("getHomepage");
        await this.$store.dispatch("getAdminMenuSections");
        await this.$store.dispatch("getAdminMenuItems");
    },
    methods: {
        addItem: function (menuItem) {
            this.menuItemToAdd = menuItem;
            this.$bvModal.show("add-to-cart-form");
        },
    },
    computed: {
        ...mapGetters(["menuItems", "menuSections", "menuItemsBySection"]),
        displayMenuSections() {
            return Object.values(this.menuSections).filter(
                (section) => section.visible
            );
        },
    },
};
</script>