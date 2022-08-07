<template>
    <b-card class="h-100 mh-100 container px-0 bg-info shadow" no-body>
        <b-tabs
            class="w-100 h-100"
            nav-class="d-none d-md-flex"
            nav-wrapper-class="text-dark h4 pt-0 px-0 d-none d-md-block"
            content-class="pt-0 h-100 pb-5"
            active-nav-item-class="bg-info active-border"
            card
            justified
            v-model="tabIndex"
        >
            <div v-if="Object.keys(displayMenuSections).length > 0" class="d-md-none d-flex justify-content-center">
                <b-dropdown
                    v-if="displayMenuSections[tabIndex]"
                    right
                    :text="displayMenuSections[tabIndex].name"
                    variant="dark"
                    class="d-md-none align-middle mt-2"
                >
                    <b-dropdown-item
                        v-for="(menuSection, index) in displayMenuSections"
                        :key="`order-dropdown-${menuSection.name}`"
                        @click.prevent="tabIndex = index"
                        >{{ menuSection.name }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            <b-tab
                class="p-0"
                v-for="(menuSection, index) in displayMenuSections"
                :key="'menuSection-' + menuSection.id"
                title-link-class="text-dark px-5 h-100 flex-center"
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
                        v-for="menuItem in visibleMenuItemsBySection[menuSection.id]"
                        :key="menuItem.id"
                        class="col-md-3 col-12 mt-4 pr-2 pl-md-5"
                        :menu-item="menuItem"
                    >
                    </OrderItem>
                </div>
            </b-tab>
        </b-tabs>
        <OrderAddToCartForm id="add-to-cart-form" :menu-item="menuItemToAdd" />
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
import Vue from "vue"

export default {
    layout: "main",
    data: function () {
        return {
            menuItemToAdd: null,
            tabIndex: 0,
        };
    },
    methods: {
        addItem: function (menuItem) {
            this.menuItemToAdd = menuItem;
            Vue.nextTick(() => {
                this.$bvModal.show("add-to-cart-form");
            })
        },
    },
    computed: {
        ...mapGetters({
            menuItems: "menu-item/all",
            menuItemsBySection: "menu-item/bySection",
            menuSections: "menu-section/all",
        }),
        visibleMenuItemsBySection() {
            let visible = {}
            for (let [id, items] of Object.entries(this.menuItemsBySection)) {
                visible[id] = items.filter((item) => item.visible)
            }
            return visible

        },
        displayMenuSections() {
            let sections = Object.values(this.menuSections).filter(
                (section) => {
                    let x = this.menuItemsBySection;
                    return section.visible && this.menuItemsBySection[section.id].length > 0
                }
            );
            return sections.sort((a, b) => (a.selfOrder > b.selfOrder ? 1 : -1));
        },
    },
};
</script>