<template>
    <b-form @submit.prevent="submit" class="w-100 w-md-50">
        <b-form-group
            id="announcement-input-group"
            label="Announcement"
            label-for="announcement"
            description="Announcement displayed over main homepage image"
        >
            <b-textarea id="announcement" rows="3" v-model="announcement">
            </b-textarea>
        </b-form-group>
        <b-button variant="dark" v-b-modal="'main-photo-gallery-modal'"
            >{{ Boolean(mainImage) ? "Replace" : "Choose" }} Main
            Photo</b-button
        >
        <div class="mb-3">
            <CloudinaryImage
                v-if="mainImage"
                class="mt-3"
                :image="mainImage"
                :thumbnail-only="true"
            ></CloudinaryImage>
        </div>
        <div>
            <b-button variant="dark" v-b-modal="'sub-photo-gallery-modal'"
                >Choose Small Photos</b-button
            >
            <div class="row mt-3">
                <CloudinaryImage
                    class="col col-md-3"
                    v-for="i in subImages"
                    :key="`homepage-${i.id}`"
                    :image="i"
                    :thumbnail-only="true"
                ></CloudinaryImage>
            </div>
        </div>
        <b-button class="mt-3" type="submit" variant="primary">Save</b-button>
        <b-modal id="main-photo-gallery-modal" size="xl">
            <PhotoGallery selecting="single" v-model="mainImage" />

            <template #modal-footer="{ close, ok }">
                <b-button variant="light" @click="close()">Cancel</b-button>
                <b-button
                    :disabled="!mainImage"
                    type="submit"
                    @click.stop.prevent="ok"
                    variant="primary"
                    >Select
                </b-button>
            </template>
        </b-modal>
        <b-modal id="sub-photo-gallery-modal" size="xl">
            <PhotoGallery selecting="multiple" v-model="subImages" />

            <template #modal-footer="{ close, ok }">
                <b-button variant="light" @click="close()">Cancel</b-button>
                <b-button
                    :disabled="!subImages"
                    type="submit"
                    @click.stop.prevent="ok"
                    variant="primary"
                    >Select {{ subImages.length }}
                </b-button>
            </template>
        </b-modal>
    </b-form>
</template>

<script>
import { mapGetters } from "vuex";
import * as Vibrant from "node-vibrant";
export default {
    data: function () {
        return {
            announcement: null,
            mainImage: null,
            subImages: [],
        };
    },
    computed: {
        ...mapGetters({ images: "image/all", homepage: "homepage/data" }),
    },
    watch: {
        homepage: {
            immediate: true,
            handler: function () {
                this.announcement = this.homepage?.announcement;
                if (this.homepage?.mainImage) {
                    this.mainImage = this.images[this.homepage.mainImage];
                }
                this.image = this.homepage?.image;
                if (this.homepage?.images) {
                    this.subImages = [];
                    this.homepage.images.forEach((imageId) => {
                        if (this.images[imageId]) {
                            this.subImages.push(this.images[imageId]);
                        }
                    });
                }
            },
        },
    },
    methods: {
        async submit() {
            document.body.style.cursor = "wait";
            var colors = {};
            await Vibrant.from(this.mainImage.thumbnail).getPalette(
                (err, palette) => {
                    if (palette) {
                        for (const p in palette) {
                            colors[p] = palette[p].hex;
                        }
                    }
                }
            );

            let data = {
                announcement: this.announcement,
                mainImage: this.mainImage?.id,
                images: this.subImages.map((i) => i.id),
                colors: colors,
            };
            await this.$store.dispatch("homepage/set", data).finally(() => {
                document.body.style.cursor = "default";
            });
        },
    },
};
</script>