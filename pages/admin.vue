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
        ...mapActions(["addImage", "getImages"]),
        async submitFile() {
            document.body.style.cursor = "wait";
            await this.addImage(this.fileForm.newImage).then((res) => {
                if (res) {
                    document.body.style.cursor = "default";
                    this.fileForm = {
                        newImage: null,
                        newImageName: "",
                        message: "File uploaded successfully",
                    };
                } else {
                    this.fileForm.message = "Error uploading file, try again";
                    document.body.style.cursor = "default";
                }
            });
        },
    },
};
</script>
