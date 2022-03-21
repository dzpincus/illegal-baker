<template>
    <b-card class="h-100 mh-100" no-body>
        <b-tabs
            class="h-100 mh-100"
            active-nav-item-class="bg-info text-dark rounded-0"
            content-class="h-100 mh-100"
            active-tab-class="h-100 mh-100"
            nav-wrapper-class="bg-dark shadow-sm"
            v-model="tabIndex"
            card
            pills
            vertical
            justified
            nav-class="border-right border-0 p-0 w-100 text-center d-none d-md-block"
        >
            <div class="d-md-none d-flex justify-content-center">
                <b-dropdown
                    right
                    :text="tabs[tabIndex]"
                    variant="dark"
                    class="d-md-none align-middle mt-2"
                >
                    <b-dropdown-item
                        v-for="(tab, index) in tabs"
                        :key="tab"
                        @click.prevent="tabIndex = index"
                        >{{ tab }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            <b-tab title-link-class="text-light px-5" title="Menu" active>
                <MenuCreation />
            </b-tab>
            <b-tab title-link-class="text-light px-5" title="Photo Gallery">
                <PhotoGallery />
            </b-tab>
            <b-tab title-link-class="text-light px-5" title="Homepage Content">
                <HomepageContent />
            </b-tab>
        </b-tabs>
    </b-card>
</template>

<style scoped>
.tab-pane {
    overflow-y: scroll;
    padding-top: 14px;
}
</style>

<script>
export default {
    layout: "main",
    middleware: "auth",
    data: function () {
        return {
            tabIndex: 0,
            tabs: ["Menu", "Photo Gallery", "Homepage Content"],
        };
    },
    async fetch() {
        await this.$store.dispatch("getImages");
        await this.$store.dispatch("getHomepage");
        await this.$store.dispatch("getMenuSections");
        await this.$store.dispatch("getMenuItems");
    },
};
</script>
