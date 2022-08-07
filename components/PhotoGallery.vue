<template>
    <div class="h-100" style="overflow-y: scroll">
        <b-form v-if="!viewOnly" @submit.prevent="submitFile" class="w-100 w-md-25 pt-md-0 pt-5">
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
        <b-form-input v-if="!viewOnly" v-model="searchText" class="w-25" placeholder="Search"></b-form-input>
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
                    :view-only="viewOnly"
                    @clicked="selectImage(image)"
                    :key="image.id"
                    v-for="image in Object.values(shownImages)"
                    :class="{
                        isClickable: Boolean(selecting),
                        selected: isSelected(image),
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
import { mapGetters } from "vuex";

export default {
    props: ["selecting", "value", "viewOnly"],
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
            selected: this.value,
            searchText: '',
        };
    },
    computed: {
        ...mapGetters({ images: "image/all" }),
        shownImages() {
            if (this.searchText) {
                let images = {}
                var regex = new RegExp(this.searchText, 'i')
                for (const [key, value] of Object.entries(this.images)) {
                    let match = value.name.match(regex)
                    if (match && match.length) {
                        images[key] = value;
                    }
                }
                return images
            }
            return this.images
        }
    },
    methods: {
        selectImage: function (image) {
            if (this.selecting === "single") {
                this.selected = image;
            } else if (this.selecting == "multiple") {
                if (this.selected.find((i) => i.id === image.id)) {
                    this.selected = this.selected.filter(
                        (i) => i.id !== image.id
                    );
                } else {
                    this.selected.push(image);
                }
            }
            this.$emit("input", this.selected);
        },
        isSelected: function (image) {
            if (!this.selected) {
                return false;
            }
            if (this.selecting === "single") {
                return this.selected.id == image.id;
            } else if (this.selecting == "multiple") {
                if (this.selected == null) {
                    this.selected = [];
                }
                return Boolean(this.selected.find((i) => i.id === image.id));
            }
        },
        async submitFile() {
            if (this.fileForm.newImage.size >= 10485760) {
                this.fileForm.message = "Image is too large"
                return;
            }
            this.imageSizeError = false;

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

            await this.$store
                .dispatch("image/add", this.fileForm)
                .then((res) => {
                    if (res) {
                        document.body.style.cursor = "default";

                        this.fileForm = {
                            newImage: null,
                            newImageName: "",
                            message: "File uploaded successfully",
                        };
                    } else {
                        this.fileForm.message =
                            "Error uploading file, try again";
                        document.body.style.cursor = "default";
                    }
                });
        },
    },
};
</script>