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
        this.$axios.setToken(
            "4c7be7d391df5318a4f8c20bbf2233c3ed36035425f9ff03412a95d58db06b35540ba8fd87971d5af52295343ad86e95dc10ae76a06982c367247b4755d12970f0ab6c754a0b747a12eb3605922b36acbb1fdb458f9e0cf1985c7efe5ee2d6c06ba5d59a92ed55b2c5c4584afded535de8ced32d67662708b821fa277307177f",
            "bearer"
        );

        const response = await this.$axios.$get(
            "http://localhost:1337/api/foods?populate[0]=photo"
        );
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