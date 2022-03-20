<template>
    <div class="row h-100 no-gutters">
        <div
            class="
                col-12 col-md-6
                flex-center
            "
            :style="`background-image: url(${mainImageUrl}); background-size: cover; background-position: center`"
        >
            <div
                v-if="announcement"
                :style="{ height: halfHeight + 'px', width: halfHeight + 'px' }"
                class="bg-info"
            >
            <h1>Announcment
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="row no-gutters h-100 w-100 flex-column">
                <div
                    class="flex-fill row no-gutters"
                    :style="{ height: halfHeight + 'px' }"
                >
                    <div
                        class="
                            col-6
                            flex-center
                            bg-info
                        "
                    >
                        <img
                            :src="logoImage"
                            class="mw-100"
                            :height="halfHeight"
                        />
                    </div>
                    <div class="col-6"></div>
                </div>
                <div
                    class="flex-fill row no-gutters"
                    :style="{ height: halfHeight + 'px' }"
                >
                    <div class="col-6"></div>
                    <div
                        class="
                            col-6
                            bg-info
                            flex-center
                        "
                    >
                        <h2>Order Today!</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters } from "vuex";
import logoImg from "assets/illegal_baker.svg";
export default {
    name: "IndexPage",
    layout: "main",
    created: function () {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    },
    data: function () {
        return {
            logoImage: logoImg,
            announcement: null,
            mainImage: null,
            images: [],
            windowHeight: 0,
        };
    },
    methods: {
        handleResize() {
            this.windowHeight = window.innerHeight;
        },
    },
    watch: {
        homepage: function () {
            this.announcement = this.homepage?.announcement;
            if (this.homepage?.mainImage) {
                this.mainImage = this.allImages[this.homepage.mainImage];
            }
            this.image = this.homepage?.image;
            if (this.homepage?.images) {
                this.images = [];
                this.homepage.images.forEach((imageId) => {
                    this.images.push(this.allImages[imageId]);
                });
            }
        },
    },
    computed: {
        ...mapGetters(["homepage", "allImages"]),
        mainImageUrl: function () {
            return (
                this.mainImage?.medium ||
                this.mainImage?.small ||
                this.mainImage?.thumbnail
            );
        },
        halfHeight: function () {
            let navHeight = this.$parent.$parent.$refs.header.$el.clientHeight;
            return (this.windowHeight - navHeight) / 2;
        },
    },
    async fetch() {
        await this.$store.dispatch("getImages");
        await this.$store.dispatch("getHomepage");
    },
};
</script>
