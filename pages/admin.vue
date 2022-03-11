<template>
    <b-card class="h-100 mh-100" no-body>
        <b-tabs
            class="h-100 mh-100"
            active-nav-item-class="bg-info text-dark rounded-0"
            content-class="h-100 mh-100"
            active-tab-class="h-100 mh-100"
            nav-wrapper-class="bg-dark shadow-sm"
            card
            pills
            vertical
            justified
            nav-class="border-right border-0 p-0 w-100 text-center"
        >
            <b-tab title-link-class="text-light px-5" title="Photo Gallery">
                <PhotoGallery :selecting="false" />
            </b-tab>
            <b-tab title-link-class="text-light" title="Menu" active>
                <MenuCreation />
            </b-tab>
            <b-tab title-link-class="text-light" title="Tab 3"> </b-tab>
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
};
</script>
