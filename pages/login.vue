<template>
    <div class="flex-center pt-5 h-100">
        <b-card
            title="Admin Login"
            class="border border-rounded border-primary p-4 shadow-sm"
        >
            <b-form @submit.prevent="login">
                <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="input-1"
                >
                    <b-form-input
                        id="input-1"
                        v-model="email"
                        type="email"
                        placeholder="Enter email"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-1"
                    label="Password:"
                    label-for="input-1"
                >
                    <b-form-input
                        id="input-1"
                        v-model="password"
                        type="password"
                        placeholder="Enter password"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary" class="float-right"
                    >Submit</b-button
                >
            </b-form>
        </b-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    layout: "main",
    computed: {
        ...mapGetters(["loggedInUser"]),
    },
    data() {
        return {
            email: "",
            password: "",
            error: null,
        };
    },
    auth: "guest",
    methods: {
        async login() {
            this.error = null;
            try {
                let response = await this.$auth.loginWith("local", {
                    data: {
                        identifier: this.email,
                        password: this.password,
                    },
                });
                this.$router.push("/admin");
            } catch (e) {
                this.error = "Error loggin in";
            }
        },
    },
};
</script>