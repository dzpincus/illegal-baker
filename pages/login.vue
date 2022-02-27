<template>
    <form method="post" @submit.prevent="login">
        <div class="field">
            <label class="label">Email</label>
            <div class="control">
                <input
                    v-model="email"
                    type="email"
                    class="input"
                    name="email"
                />
            </div>
        </div>
        <div class="field">
            <label class="label">Password</label>
            <div class="control">
                <input
                    v-model="password"
                    type="password"
                    class="input"
                    name="password"
                />
            </div>
        </div>
        <div class="control">
            <button type="submit" class="button is-dark">Log In</button>
            <template v-if="loggedInUser">
                <NuxtLink to="/admin">{{ $auth.state }}</NuxtLink>
            </template>
        </div>
    </form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
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
                debugger;
                // this.$auth.setUserToken(response.jwt);
                // await this.$auth.setUser(response.data.user);
                // await this.$auth.setUserToken(response.data.jwt);

                this.$router.push("/admin");
            } catch (e) {
                this.error = "Error loggin in";
            }
        },
    },
};
</script>