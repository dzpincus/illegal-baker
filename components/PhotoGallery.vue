<template>
    <div>
        <b-form @submit.prevent="submitFile" class="w-100 w-md-25 pt-md-0 pt-5">
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
            <b-card-group columns>
                <ImageCard
                    @clicked="selectImage(image)"
                    :key="image.id"
                    v-for="image in Object.values(images)"
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
    props: ["selecting", "value"],
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
        };
    },
    computed: {
        ...mapGetters({ images: "image/all" }),
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