<template>
    <div class="vh-100 d-flex flex-column" style="overflow-y: hidden">
        <PageHeader ref="header" class="sticky-top" style></PageHeader>
        <transition name="fade">
            <Nuxt class="border-0" style="overflow-y: hidden" />
        </transition>
    </div>
</template>

<script>
export default {
    async fetch() {
        await this.$store.dispatch("getImages");
        await this.$store.dispatch("getHomepage");
        await this.$store.dispatch("getAdminMenuSections");
        await this.$store.dispatch("getAdminMenuItems");
    },
};
</script>
