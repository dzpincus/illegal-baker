<template>
    <b-card class="my-4 mr-4 p-0" @click="$emit('clicked')">
        <template #header>
            <div class="d-flex justify-content-between align-items-center">
                <b-input v-if="editing" v-model="newName"> </b-input>
                <span v-else>
                    {{ image.name }}
                </span>
                <div v-if="editing" class="float-right">
                    <a
                        v-b-tooltip.hover
                        title="Save"
                        class="isClickable pl-2"
                        @click="save"
                    >
                        <font-awesome-icon icon="floppy-disk" />
                    </a>
                </div>
                <div v-else class="float-right">
                    <a
                        v-b-tooltip.hover
                        title="Delete Image"
                        class="isClickable pr-2"
                        @click.stop="deleteImage"
                    >
                        <font-awesome-icon icon="trash" />
                    </a>
                    <a
                        v-b-tooltip.hover
                        title="Edit"
                        class="isClickable"
                        @click="editing = true"
                    >
                        <font-awesome-icon icon="pencil" />
                    </a>
                </div>
            </div>
        </template>
        <b-card-body class="d-flex align-items-center justify-content-center">
            <div class="mh-100">
                <CloudinaryImage :image="image" />
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    props: ["image"],
    data: function () {
        return {
            newFile: null,
            newName: "",
            editing: false,
        };
    },
    mounted: function () {
        this.newName = this.image.name;
    },
    methods: {
        ...mapActions(["removeImage", "updateImage"]),
        async save() {
            if (this.newName != this.image.name) {
                document.body.style.cursor = "wait";
                let data = { name: this.newName };
                await this.updateImage({ id: this.image.id, data: data }).then(
                    () => {
                        document.body.style.cursor = "default";
                        this.editing = false;
                    }
                );
            } else {
                this.editing = false;
            }
        },
        async deleteImage() {
            if (confirm("Are you sure you want to delete this image?")) {
                document.body.style.cursor = "wait";
                await this.removeImage(this.image);
                document.body.style.cursor = "default";
            }
        },
    },
};
</script>