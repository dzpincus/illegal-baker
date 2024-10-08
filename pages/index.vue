<template>
    <div class="row h-100 no-gutters" ref="container" style="overflow-y: scroll !important">
        <div
            class="col-12 col-md-6 flex-center p-md-3 p-0 h-100 d-md-block"
            :style="{ backgroundColor: '#ce997f' }"
        >
            <div
                class="flex-center h-100 w-100"
                style="filter: drop-shadow(0 0 30px #333)"
                :style="`background-image: url(${mainImageUrl}); background-size: cover; background-position: center`"
            >
                <div
                    v-if="announcement && !hideAnnouncement"
                    class="text-dark flex-center rounded"
                    style="
                        max-width: 50%;
                        max-height: 50%;
                        min-width: 50%;
                        opacity: 0.9;
                    "
                    v-b-hover="announcementHover"
                    :style="{
                        height: this.halfHeight,
                        backgroundImage: gradient(
                            '#ce997f'
                        ),
                    }"
                >
                    <p
                        class="text-center px-3 py-2 mt-3 mt-md-0 mh-100 overflow-auto"
                        v-resize-text="{
                            ratio: 1.3,
                            minFontSize: '30px',
                            maxFontSize: '40px',
                            delay: 200,
                        }"
                    >
                        {{ announcement }}
                    </p>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 h-100">
            <div class="d-flex flex-column w-100 h-100">
                <div
                    class="flex-fill row no-gutters"
                    :style="{ height: halfHeight }"
                >
                    <div
                        class="col-6 flex-center"
                        :style="{
                            height: halfHeight,
                            backgroundImage: subColor,
                            opacity: .85
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
                            :interval="6000"
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
                            backgroundImage: subColor,
                            opacity: .85
                        }"
                    >
                        <h2 class="text-dark">Order Today!</h2>
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
    auth: 'guest',
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
            allImages: [],
            windowHeight: 0,
            mainImageUrl: "",
            carousel2Interval: 0,
            hideAnnouncement: false,
            showDismiss: false,
            subColor: "linear-gradient(141deg, rgba(241,255,98,0.5970763305322129) 0%, rgba(254,238,0,1) 35%, rgba(255,154,0,1) 100%)"
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
                if (self.$refs.carousel2) {
                    setTimeout(function () {
                        self.$refs.carousel2.next();
                    }, 3000);
                }
            }
        },
        resizeHandler() {
            if (process.browser) {
                this.windowHeight = window.innerHeight;
            }
        },
        async setImages() {
            this.announcement = this.homepage?.announcement;
            if (!this.images || this.images.length === 0) {
                await this.$store.dispatch("image/get")
            } else if (this.images) {
                if (this.homepage?.mainImage) {
                    this.mainImage = this.images[this.homepage.mainImage];
                    this.mainImageUrl =
                        this.mainImage?.medium ||
                        this.mainImage?.small ||
                        this.mainImage?.thumbnail;
                    if (this.mainImage && this.mainImage.id) {
                        this.allImages.push(this.mainImage)
                    }
                }
                this.image = this.homepage?.image;
                if (this.homepage?.images) {
                    this.images1 = [];
                    this.images2 = [];
                    this.homepage.images.forEach((imageId, index) => {
                        if (this.images[imageId]) {
                            this.allImages.push(this.images[imageId]);
                        }
                        const currentImage = this.images[imageId]
                        if (currentImage) {
                            if (index % 2 == 0) {
                                this.images1.push(currentImage);
                            } else {
                                this.images2.push(currentImage);
                            }
                        }
                    });
                }
            }
        },
        colorLuminance(hex, lum) {
            // let lum = 0.07; // -0.1
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, "");
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }

            // convert to decimal and change luminosity
            let rgb = "#",
                c,
                i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(
                    Math.min(Math.max(0, c + c * lum), 255)
                ).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        },

        gradient: function (color) {
            let firstGradient = this.colorLuminance(color, 0.8);
            let secondGradient = this.colorLuminance(color, -0.5);
            
            return `linear-gradient(145deg, ${firstGradient}, ${secondGradient})`;
        },
    },
    watch: {
        homepage: {
            handler: function () {
                this.setImages();
            },
            immediate: true,
        },
        images: {
            immediate: true,
            handler(value) {
                this.setImages();
            }
        }
    },
    computed: {
        ...mapGetters({ homepage: "homepage/data", images: "image/all" }),
        halfHeight: function () {
            if (process.browser) {
                let navHeight =
                    this.$parent.$parent.$refs.header.$el.clientHeight;
                return `${(this.windowHeight - navHeight) / 2}px`;
            }
        },
    },
};
</script>
