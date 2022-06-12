<template>
    <div id="stripe"></div>
</template>


<script>
import { mapGetters } from "vuex";
import { loadStripe } from "@stripe/stripe-js";

export default {
    props: ["value"],
    mounted: function () {
        this.getPaymentIntent();
    },
    data: function () {
        return { stripe: null, elements: null };
    },
    computed: {
        ...mapGetters({ total: "cart/total" }),
    },
    watch: {
        total() {
            this.getPaymentIntent();
        },
    },
    data: function () {
        return {
            stripeKey: process.env.stripeKey,
            clientSecret: null,
            elementOptions: {
                appearance: {
                    theme: "stripe",
                },
            },
        };
    },
    methods: {
        async confirm() {
            let elements = this.elements;
            const { error } = await this.stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url:
                        location.protocol + "//" + location.host + "/confirm",
                },
            });
        },
        paymentUpdated(event) {
            this.$emit("canContinue", event.complete);
        },
        async getPaymentIntent() {
            if (this.total > 0) {
                this.stripe = await loadStripe(process.env.stripeKey);
                let self = this;
                await this.$axios
                    .post("/payment-intent", {
                        total: this.total.toFixed(2).toString(),
                    })
                    .then((response) => {
                        self.clientSecret = response.data.clientSecret;
                        let clientSecret = self.clientSecret;
                        let data = this.value;
                        data["payment"] = {"clientSecret": clientSecret};
                        this.$emit("input", data);
                        const appearance = {
                            theme: "stripe",
                        };
                        self.elements = self.stripe.elements({
                            appearance,
                            clientSecret,
                        });
                        const paymentElement = self.elements.create("payment");
                        paymentElement.mount("#stripe");
                        paymentElement.on("change", (event) =>
                            self.paymentUpdated(event)
                        );
                    });
            }
        },
    },
};
</script>