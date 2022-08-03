<template>
    <div>
        <div class="pb-2">
            A 2.9% fee will be added for credit card purchases
        </div>
        <b-form-radio-group 
            v-model="type"
            :options="typeOptions"
            button-variant="outline-dark"
            size="lg"
            buttons
            class="pb-4"></b-form-radio-group>
        
        <div v-show="type === 'stripe'" id="stripe"></div>
    </div>
</template>


<script>
import { mapGetters } from "vuex";
import { loadStripe } from "@stripe/stripe-js";

export default {
    props: ["value"],
    mounted: function () {
        this.getPaymentIntent();
    },
    computed: {
        ...mapGetters({ total: "cart/total" }),
    },
    watch: {
        total() {
            this.getPaymentIntent();
        },
        type: {
            immediate: true,
            handler(newVal, oldVal) {
                this.$emit("canContinue", newVal === 'cash');
                if (newVal === 'cash') {
                    let data = this.value;
                    data["payment"] = {
                        "type": "cash",
                    };
                    this.$emit("input", data);
                }
            }
        }
    },
    data: function () {
        return {
            type: '',
            typeOptions: [
                { text: "Cash", value: "cash" },
                { text: "Credit Card", value: "stripe" }
            ],
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
            let data = this.value;
            data["payment"] = {
                "type": "stripe",
                "clientSecret": this.clientSecret
            };
            this.$emit("input", data);
            this.$emit("canContinue", event.complete);
        },
        async getPaymentIntent() {
            if (this.total > 0) {
                this.stripe = await loadStripe(process.env.stripeKey);
                let self = this;
                let feeTotal = this.total + (this.total * .029)
                await this.$axios
                    .post("/payment-intent", {
                        total: feeTotal.toFixed(2).toString(),
                    })
                    .then((response) => {
                        self.clientSecret = response.data.clientSecret;
                        let clientSecret = self.clientSecret;
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