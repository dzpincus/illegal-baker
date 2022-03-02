<template>
    <b-card class="h-100 mh-100" no-body>
        <b-tabs
            class="h-100 mh-100"
            active-nav-item-class="bg-info"
            content-class="h-100 mh-100"
            active-tab-class="h-100 mh-100"
            nav-wrapper-class="bg-secondary"
            pills
            card
            vertical
        >
            <b-tab title-link-class="text-dark" title="Photo Gallery" active>
                <!-- <font-awesome-icon icon="gear" /> -->
                <b-form @submit.prevent="submitFile" class="w-25">
                    <b-form-file
                        class="mb-3"
                        accept=".jpg, .png, .jpeg"
                        v-model="fileForm.newImage"
                        :state="Boolean(fileForm.newImage)"
                        placeholder="Upload a new image"
                        drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <b-form-group id="input-group-1" label-for="photo-input">
                        <div class="pt-3 d-flex align-items-center">
                            <b-button type="submit" variant="primary"
                                >Upload
                            </b-button>
                            <p
                                v-if="fileForm.message"
                                class="m-0 pl-4"
                                :class="[
                                    fileForm.newImage
                                        ? 'text-danger'
                                        : 'text-success',
                                ]"
                            >
                                {{ fileForm.message }}
                            </p>
                        </div>
                    </b-form-group>
                </b-form>
                <div class="d-flex flex-column align-items-center">
                    <b-pagination
                        v-if="totalCount > pageSize"
                        @change="updatePage"
                        v-model="currentPage"
                        :per-page="pageSize"
                        :total-rows="totalCount"
                    >
                    </b-pagination>
                    <b-card-group columns>
                        <ImageCard
                            @deleteImage="deleteImage"
                            :key="image.id"
                            v-for="image in allImages"
                            :image="image"
                        />
                    </b-card-group>
                    <b-pagination
                        v-if="totalCount > pageSize"
                        v-model="currentPage"
                        :per-page="pageSize"
                        :total-rows="totalCount"
                    ></b-pagination>
                </div>
            </b-tab>
            <b-tab title-link-class="text-dark" title="Menu">
                <MenuCreation />
            </b-tab>
            <b-tab title-link-class="text-dark" title="Tab 3"> </b-tab>
        </b-tabs>
    </b-card>
</template>

<style scoped>
.tab-pane {
    overflow-y: scroll;
    padding-top: 14px;
}
</style>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    layout: "main",
    middleware: "auth",
    data: function () {
        return {
            fileForm: {
                newImage: null,
                message: "",
            },
            pageSize: 25,
            totalCount: 0,
            currentPage: 1,
        };
    },
    async fetch() {
        await this.getImages();
    },
    computed: {
        ...mapGetters(["allImages"]),
    },
    methods: {
        ...mapActions(["addImage", "removeImage"]),
        async getImages() {
            await this.$axios
                .get("/upload/files?populate[0]=image")
                .then((res) => {
                    let data = [];
                    res.data.forEach((element) => {
                        data.push(this.makeImage(element));
                    });
                    this.$store.commit("setImages", data);
                    this.totalCount = data.length;
                });
        },
        makeImage: function (data) {
            let image = {
                id: data.id,
                name: data.name,
            };
            let formats = data.formats;
            let urls = this.parseImageFormats(formats);
            Object.assign(image, urls);
            return image;
        },
        parseImageFormats: function (formats) {
            let urlFormats = {};
            ["medium", "small", "thumbnail"].forEach((format) => {
                if (formats.hasOwnProperty(format)) {
                    urlFormats[format] = formats[format].url;
                }
            });
            return urlFormats;
        },
        async submitFile() {
            document.body.style.cursor = "wait";

            const formData = new FormData();
            formData.append("files", this.fileForm.newImage);

            let res = await this.$axios
                .post("/upload", formData)
                .then((res) => {
                    this.fileForm = {
                        newImage: null,
                        newImageName: "",
                        message: "File uploaded successfully",
                    };
                    document.body.style.cursor = "default";
                    this.addImage(this.makeImage(res.data[0]));
                })
                .catch((e) => {
                    this.fileForm.message = "Error uploading file, try again";
                    document.body.style.cursor = "default";
                });
        },
        deleteImage: function (imageId) {
            this.$store.commit("removeImage", imageId);
        },
    },
};
</script>
