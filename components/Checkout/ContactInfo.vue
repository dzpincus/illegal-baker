<template>
    <b-form>
        <b-form-group label="Name" label-for="name-input">
            <b-input required id="name-input" v-model="formData.name"></b-input>
        </b-form-group>
        <div class="d-flex justify-content-start">
            <b-form-group
                label="Phone"
                label-for="phone-input"
                class="w-100 pr-2"
            >
                <b-input
                    required
                    type="tel"
                    id="phone-input"
                    v-model="formData.phone"
                ></b-input>
            </b-form-group>
            <b-form-group
                :validated="emailStarted"
                label="Email"
                label-for="email-input"
                class="w-100"
            >
                <b-input
                    @input="emailStarted = true"
                    required
                    type="email"
                    id="email-input"
                    v-model="formData.email"
                ></b-input>
            </b-form-group>
        </div>
    </b-form>
</template>

<script>
export default {
    props: ["value"],
    data: function () {
        return {
            formData: {
                name: "",
                phone: "",
                email: "",
            },
            emailStarted: false,
        };
    },
    computed: {
        canContinue() {
            return (
                this.formData.name && this.formData.phone && this.formData.email
            );
        },
    },
    watch: {
        canContinue: {
            immediate: true,
            handler: function () {
                this.$emit("canContinue", this.canContinue);
            },
        },
        formData: {
            deep: true,
            handler: function () {
                let data = this.value;
                data["contactInfo"] = {
                    name: this.formData.name,
                    phone: this.formData.phone,
                    email: this.formData.email,
                };
                this.$emit("input", data);
            },
        },
    },
};
</script>