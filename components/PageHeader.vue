<template>
    <b-navbar
        ref="navbar"
        class="m-0"
        toggleable="md"
        type="dark"
        variant="dark"
        style="height: auto"
    >
        <b-navbar-brand>
            <NuxtLink to="/">
                <img
                    src="~/assets/images/illegal_baker_words.svg"
                    class="nav-image-height"
                />
            </NuxtLink>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item
                    v-for="page in pages"
                    :key="page.path"
                    :active="$nuxt.$route.path === page.path"
                    class="ml-3"
                    :to="page.path"
                    ><h3>{{ page.title }}</h3>
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<style>
.headerPanel {
    background-color: #e3dbcb;
}
</style>

<script>
export default {
    name: "pageHeader",

    data: function () {
        let pages = [
            { title: "Home", path: "/" },
            { title: "About", path: "/about" },
            { title: "Order Online", path: "/order" },
        ];
        if (this.$store.state.auth.loggedIn) {
            pages.push({ title: "Admin", path: "/admin" });
        }
        return { pages: pages };
    },
};
</script>
