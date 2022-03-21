<template>
    <div class="vh-100 d-flex flex-column" style="overflow-y: hidden">
        <PageHeader ref="header" class="sticky-top" style></PageHeader>
        <transition name="fade">
            <Nuxt class="border-0" style="overflow-y: hidden" />
        </transition>
    </div>
</template>
