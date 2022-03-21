<template>
    <div class="row h-100 no-gutters" ref="container">
        <div
            class="col-12 col-md-6 flex-center p-md-3 p-0 h-100"
            :style="{ backgroundColor: homepage.colors['LightVibrant'] }"
        >
            <div
                class="flex-center h-100 w-100"
                style="filter: drop-shadow(0 0 30px #333)"
                :style="`background-image: url(${mainImageUrl}); background-size: cover; background-position: center`"
            >
                <div
                    v-if="announcement && !hideAnnouncement"
                    class="text-light flex-center flex-column rounded"
                    style="max-width: 50%; max-height: 50%; opacity: 0.9"
                    :style="{ backgroundColor: homepage.colors['DarkMuted'] }"
                    v-b-hover="announcementHover"
                >
                    <div class="p-5">
                        <h1 class="d-none d-md-block">{{ announcement }}</h1>
                        <h6 class="d-block d-md-none">{{ announcement }}</h6>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 d-md-block d-none h-100">
            <div class="d-flex flex-column w-100 h-100">
                <div
                    class="flex-fill row no-gutters"
                    :style="{ height: halfHeight }"
                >
                    <div
                        class="col-6 flex-center"
                        :style="{
                            height: halfHeight,
                            backgroundColor: homepage.colors['Muted'],
                        }"
                    >
                        <img
                            src="~/assets/images/illegal_baker.svg"
                            class="mw-100"
                            :height="halfHeight"
                        />
                    </div>
                    <div class="col-6" :style="{ height: halfHeight }">
                        <b-carousel
                            id="carousel-1"
                            :interval="images1.length > 1 ? 6000 : 0"
                            img-width="100%"
                            :img-height="halfHeight"
                            :style="{ height: halfHeight }"
                            @sliding-end="onSlideEnd"
                            :no-hover-pause="true"
                            class="m-0 w-100"
                        >
                            <b-carousel-slide
                                class="h-100"
                                v-for="image in images1"
                                :key="`homepage-${image.id}`"
                            >
                                <template #img>
                                    <CloudinaryImage
                                        :image="image"
                                        class="h-100"
                                        style="position: relative"
                                    />
                                </template>
                            </b-carousel-slide>
                        </b-carousel>
                    </div>
                </div>
                <div
                    class="flex-fill row no-gutters"
                    :style="{ height: halfHeight }"
                >
                    <div class="col-6" :style="{ height: halfHeight }">
                        <b-carousel
                            id="carousel-2"
                            ref="carousel2"
                            :interval="carousel2Interval"
                            img-width="100%"
                            :img-height="halfHeight"
                            :style="{ height: halfHeight }"
                            :no-hover-pause="true"
                            class="m-0 w-100"
                        >
                            <b-carousel-slide
                                class="h-100"
                                v-for="image in images2"
                                :key="`homepage-${image.id}`"
                            >
                                <template #img>
                                    <CloudinaryImage
                                        :image="image"
                                        class="h-100"
                                        style="position: relative"
                                    />
                                </template>
                            </b-carousel-slide>
                        </b-carousel>
                    </div>
                    <div
                        class="col-6 text-light flex-center"
                        :style="{
                            height: halfHeight,
                            backgroundColor: homepage.colors['DarkVibrant'],
                        }"
                    >
                        <h2>Order Today!</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.carousel-inner {
    height: 100% !important;
}
</style>


<script>
import { mapGetters } from "vuex";
export default {
    name: "IndexPage",
    layout: "main",
    mounted() {
        if (process.browser) {
            window.addEventListener("resize", this.resizeHandler);
            this.resizeHandler();
        }
        this.setImages();
    },
    destroyed() {
        if (process.browser) {
            window.removeEventListener("resize", this.ResizeHandler);
        }
    },
    updated() {
        this.resizeHandler();
    },
    data: function () {
        return {
            announcement: null,
            mainImage: null,
            images1: [],
            images2: [],
            windowHeight: 0,
            mainImageUrl: "",
            carousel2Interval: 0,
            hideAnnouncement: false,
            showDismiss: false,
        };
    },
    methods: {
        announcementHover(isHovered) {
            this.showDismiss = isHovered;
        },
        onSlideEnd() {
            if (this.images2.length > 1 && this.carousel2Interval == 0) {
                this.carousel2Interval = 6000;
                var self = this;
                setTimeout(function () {
                    self.$refs.carousel2.next();
                }, 3000);
            }
        },
        resizeHandler() {
            if (process.browser) {
                this.windowHeight = window.innerHeight;
            }
        },
        setImages() {
            this.announcement = this.homepage?.announcement;
            if (this.homepage?.mainImage) {
                this.mainImage = this.allImages[this.homepage.mainImage];
                this.mainImageUrl =
                    this.mainImage?.medium ||
                    this.mainImage?.small ||
                    this.mainImage?.thumbnail;
            }
            this.image = this.homepage?.image;
            if (this.homepage?.images) {
                this.images1 = [];
                this.images2 = [];
                this.homepage.images.forEach((imageId, index) => {
                    if (index % 2 == 0) {
                        this.images1.push(this.allImages[imageId]);
                    } else {
                        this.images2.push(this.allImages[imageId]);
                    }
                });
            }
            this.$emit("updateNavColor", this.homepage.colors["LightVibrant"]);
        },
    },
    watch: {
        homepage: {
            handler: function () {
                this.setImages();
            },
            immediate: true,
        },
    },
    computed: {
        ...mapGetters(["homepage", "allImages"]),
        halfHeight: function () {
            if (process.browser) {
                let navHeight =
                    this.$parent.$parent.$refs.header.$el.clientHeight;
                return `${(this.windowHeight - navHeight) / 2}px`;
            }
        },
    },
    async fetch() {
        await this.$store.dispatch("getImages");
        await this.$store.dispatch("getHomepage");
    },
};
</script>
