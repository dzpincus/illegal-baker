<template>
    <div v-if="active">
        <h5><strong>Order Total: </strong>${{ total }}</h5>
        <h5 class="text-capitalize">
            <strong>Order Type: </strong>{{ value.delivery.type }}
        </h5>
        <template v-if="value.delivery.type == 'delivery'">
            <h5>
                <strong>Delivery Address: </strong
                >{{ value.delivery.deliveryAddress }}
            </h5>
            <h5 v-if="value.delivery.deliveryInstructions">
                <strong>Delivery Instructions: </strong
                >{{ value.delivery.deliveryInstructions }}
            </h5>
        </template>
        <template v-else>
            <h5>
                <strong>Pickup Location: </strong
                >{{ value.delivery.selectedPickupLocation }}
            </h5>
            <h5>
                <strong>Pickup Date: </strong>{{ value.delivery.pickupDate }}
            </h5>
        </template>
        <b-button @click.prevent="submit" class="mt-4" variant="primary" block
            >Submit Order</b-button
        >
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { loadStripe } from "@stripe/stripe-js";
export default {
    props: ["value", "active"],
    computed: {
        ...mapGetters({ total: "cart/total", cartItems: "cart/items" }),
    },
    methods: {
        async submit() {
            document.body.style.cursor = "wait";
            let data = {orderData: this.value, orderItems: Object.values(this.cartItems)};
            await this.$store
                .dispatch("order/set", data)
                .then(() => {
                    this.$parent.$parent.$refs.CheckoutPaymentComponent[0].confirm()
                }
                );
        },
    },
};
</script>
