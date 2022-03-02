<template>
    <div class="d-flex justify-content-center">
        <b-carousel
            id="carousel-fade"
            style="text-shadow: 0px 0px 2px #000"
            fade
            controls
            img-width="100px"
            img-height="100px"
        >
            <b-carousel-slide v-for="(item, index) in photoUrls" :key="index">
                <template #img>
                    <NuxtImg
                        class="d-md-none"
                        provider="cloudinary"
                        :src="item"
                        width="200"
                        height="200"
                    />
                    <NuxtImg
                        class="d-none d-md-block"
                        provider="cloudinary"
                        :src="item"
                        width="700"
                        height="700"
                    />
                </template>
            </b-carousel-slide>
        </b-carousel>
    </div>
</template>


<style>
</style>

<script>
export default {
    data() {
        return {
            photoUrls: [],
        };
    },
    async fetch() {
        const axiosIntance = this.$axios.create({
            baseURL: process.env.baseURL,
            headers: {
                Authorization: `Bearer ${process.env.strapiAppToken}`,
            },
        });
        const response = await axiosIntance.$get("/foods?populate[0]=photo");
        if (response.data) {
            for (var i = 0; i < response.data.length; i++) {
                this.photoUrls.push(
                    response.data[i].attributes.photo.data.attributes.url
                );
            }
        }
    },
};
</script>