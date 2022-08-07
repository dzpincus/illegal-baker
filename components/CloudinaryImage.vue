<template>
    <div class="mh-100" :style="{ width: width }">
        <NuxtImg
            v-if="!thumbnailOnly && image"
            provider="cloudinary"
            :src="image.medium || image.small || image.thumbnail"
            class="img-fluid h-100 d-none d-md-block"
            :width="width || 450"
            :modifiers="{ rotate: image.rotate }"

        />
        <div
            v-else-if="!thumbnailOnly"
            class="d-none d-md-block h-100"
            :width="width || 450"
        >
            <font-awesome-icon icon="camera" size="4x" class="w-100" />
        </div>
        <NuxtImg
            v-if="image"
            provider="cloudinary"
            :src="image.medium || image.small || image.thumbnail"
            :class="[thumbnailOnly ? '' : 'd-md-none']"
            class="img-fluid h-100 d-block"
            :width="width || 200"
            :height="height || 200"
            :modifiers="{ rotate: image.rotate }"
            :fit="!viewOnly ? 'contain' : 'outside'"
        />
        <div v-else :class="[thumbnailOnly ? '' : 'd-md-none']" class="d-block">
            <font-awesome-layers
                style="height: 200px; width: 200px"
                class="fa-4x"
                full-width
            >
                <font-awesome-icon icon="camera" size="2x" />
                <font-awesome-icon icon="slash" size="2x" />
            </font-awesome-layers>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        image: {
            type: Object,
        },
        thumbnailOnly: {
            type: Boolean,
            default: false,
        },
        height: {
            type: String,
            default: "",
        },
        width: {
            type: String,
            default: "",
        },
    },
};
</script>