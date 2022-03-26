<template>
    <div class="vh-100 d-flex flex-column" style="overflow-y: hidden">
        <PageHeader ref="header" class="sticky-top" style></PageHeader>
        <transition name="fade">
            <Nuxt class="border-0 overflow-hidden" />
        </transition>
    </div>
</template>

<script>
export default {
    async fetch() {
        await this.$store.dispatch("image/get");
        await this.$store.dispatch("homepage/get");
        await this.$store.dispatch("menu-section/get");
        await this.$store.dispatch("menu-item/get");
    },
};
</script>
