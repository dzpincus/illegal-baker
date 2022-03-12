<template>
    <div>
        <b-form @submit.prevent="submitFile" class="w-25">
            <b-form-file
                class="mb-3"
                accept=".jpg, .png, .jpeg"
                v-model="fileForm.newImage"
                :state="Boolean(fileForm.newImage)"
                placeholder="Upload a new image"
                drop-placeholder="Drop file here..."
            ></b-form-file>
            <b-form-input
                v-if="fileForm.newImage"
                class="pt-2"
                v-model="fileForm.newImageName"
                placeholder="New image name"
            ></b-form-input>
            <b-form-group id="input-group-1" label-for="photo-input">
                <div class="pt-3 d-flex align-items-center">
                    <b-button
                        :disabled="!fileForm.newImage || !fileForm.newImageName"
                        type="submit"
                        variant="primary"
                        >Upload
                    </b-button>
                    <p
                        v-if="fileForm.message"
                        class="m-0 pl-4"
                        :class="[
                            fileForm.newImage ? 'text-danger' : 'text-success',
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
              <h1>{{Object.values(allImages).length}}</h1>
            
            <b-card-group columns>
                <ImageCard
                    @clicked="selectImage(image)"
                    :key="image.id"
                    v-for="image in Object.values(allImages)"
                    :class="{
                        isClickable: selecting,
                        selected: Boolean(
                            selectedImage && selectedImage.id == image.id
                        ),
                    }"
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
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    props: ["selecting"],
    data: function () {
        return {
            fileForm: {
                newImage: null,
                newImageName: "",
                message: "",
            },
            pageSize: 25,
            totalCount: 0,
            currentPage: 1,
            selectedImage: null,
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
        selectImage: function (image) {
            if (this.selecting) {
                this.selectedImage = image;
            }
        },
        async submitFile() {
            document.body.style.cursor = "wait";

            const formData = new FormData();
            formData.append(
                "files.image",
                this.fileForm.newImage,
                this.fileForm.newImageName
            );
            formData.append(
                "data",
                JSON.stringify({ name: this.fileForm.newImageName })
            );

            await this.addImage(this.fileForm).then((res) => {
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