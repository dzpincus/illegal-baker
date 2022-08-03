<template>
    <div v-if="active">
        <template v-if="value.payment.type === 'stripe'">
            <h5><strong>Order Subtotal : </strong>${{ total }}</h5>
            <h5><strong>2.9% Processing Fee: </strong>${{ ccFee }}</h5>
        </template>
        <h5><strong>Order Total: </strong>${{ feeTotal }}</h5>
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
        ccFee() {
            return (this.total * .029).toFixed(2)
        },
        feeTotal() {
            if (this.value.payment.type === 'stripe') {
                return (this.total + (this.total * .029)).toFixed(2)
            }
            return this.total
        }
    },
    methods: {
        async submit() {
            document.body.style.cursor = "wait";
            let data = {orderData: this.value, orderItems: Object.values(this.cartItems), total: this.feeTotal};
            await this.$store
                .dispatch("order/set", data)
                .then(() => {
                    if (this.value.payment.type === 'stripe') {
                        this.$parent.$parent.$refs.CheckoutPaymentComponent[0].confirm()
                    } else {
                        setTimeout(() => {
                            document.body.style.cursor = "default";
                            this.$router.push({ name: 'confirm' });
                        }, 1000)
                    }
                }
                );
        },
    },
};
</script>
