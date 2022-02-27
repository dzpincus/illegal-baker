<template>
    <header>
        <div
            class="
                headerPanel
                w-100
                d-flex
                flex-column
                align-items-center
                border-bottom border-dark border-3
            "
        >
            <div style="height: 100px">
                <img class="img-fluid h-100" src="~/assets/amy.png" />
            </div>
            <h2>
                <i>The Illegal Baker</i>
            </h2>
            <h1>t<NuxtLink to="/admin">Test</NuxtLink></h1>
        </div>
    </header>
</template>

<style>
.headerPanel {
    background-color: #e3dbcb;
}
</style>

<script>
export default {
    name: "pageHeader",
};
</script>
