<template>
    <b-card class="my-4 mr-4 p-0" @click="$emit('clicked')">
        <template #header>
            <div class="d-flex justify-content-between align-items-center">
                <span>
                    {{ image.name }}
                </span>
                <div class="float-right">
                    <a
                        v-b-tooltip.hover
                        title="Delete Image"
                        class="isClickable"
                        @click.stop="deleteImage"
                    >
                        <font-awesome-icon icon="trash" />
                    </a>
                </div>
            </div>
        </template>
        <b-card-body class="d-flex align-items-center justify-content-center">
            <div class="mh-100">
                <NuxtImg
                    provider="cloudinary"
                    :src="image.medium || image.small || image.thumbnail"
                    class="img-fluid h-100 d-none d-md-block"
                    width="450"
                />
                <NuxtImg
                    provider="cloudinary"
                    :src="image.thumbnail"
                    class="img-fluid h-100 d-block d-md-none"
                    width="200"
                    height="200"
                />
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
    props: ["image"],
    data: function () {
        return {
            name: this.image.name,
            newFile: null,
        };
    },
    methods: {
        ...mapActions(["removeImage"]),
        async deleteImage() {
            if (confirm("Are you sure you want to delete this image?")) {
                document.body.style.cursor = "wait";
                await this.removeImage(this.image.id);
                document.body.style.cursor = "default";
            }
        },
    },
};
</script>