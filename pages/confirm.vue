<template>
    <div v-if="orderData && orderData.orderData" class="h-100 mh-100 pt-4 container px-0 bg-info shadow d-flex align-items-center flex-column">
        <h1>Order Confirmed!</h1>
        <p>
            Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <div class="w-50 p-5 border rounded border-dark h5">
            <div class="d-flex justify-content-between">
                <span>Order Number</span>
                <span>{{ orderData.id }}</span>
            </div>
            <hr class="my-3"/>
            <template v-if="orderData.orderData && orderData.orderData.delivery.type === 'pickup'">
                <div class="d-flex justify-content-between">
                    <span>Pickup Date</span>
                    <span>{{ pickupDate }}</span>
                </div>
                <hr class="my-3"/>
                <div class="d-flex justify-content-between">
                    <span>Pickup Location</span>
                    <span class="text-right w-50">{{ orderData.orderData.delivery.selectedPickupLocation }}</span>
                </div>
            </template>
            <template v-else>
                <div class="d-flex justify-content-between">
                    <div>
                        <span>Requested Delivery Date</span>
                        <br>
                    </div>
                    <span>{{ deliveryDate }}</span>
                </div>
                <hr class="my-3"/>
                <div class="d-flex justify-content-between">
                    <span>Delivery Location</span>
                    <span class="text-right float-right">{{ orderData.orderData.delivery.deliveryAddress }}</span>
                    <br>
                    <span v-if="orderData.orderData.delivery.deliveryInstructions" class="text-right w-50">
                        {{ orderData.orderData.delivery.deliveryInstructions }}
                    </span>
                </div>
            </template>
            <hr class="my-3"/>
            <div class="d-flex justify-content-between">
                <span>Payment</span>
                <span v-if="orderData.orderData && orderData.orderData.payment.type === 'cash'">Cash on order {{ orderData.orderData.delivery.type }}</span>
                <span v-else>Paid in full</span>
            </div>
            <hr class="my-3"/>
            <div class="d-flex justify-content-between">
                <div class="mr-5">Order Details:</div>
                <div class="d-flex flex-column pb-4 text-right">
                    <div v-for="item in orderData.orderItems" class="d-flex flex-column">
                        <div>{{ item.name }} <span>x {{ item.quantity }}</span></div>
                        <div v-if="item.specialRequests" class="small">
                            <span class="italic">SPECIAL REQUEST: </span>{{ item.specialRequests }}
                        </div>
                        <div
                            v-for="(option, index) in Object.keys(item.options)"
                            :key="`${item.name}-option-${index}`"
                            class="small align-self-end"
                        >
                            <template v-if="isArray(item.options[option])">
                                <template v-if="item.options[option].length > 0">
                                    {{ option }}
                                    <ul>
                                        <li v-for="(subOption, subIndex) in item.options[option]" :key="`${subOption}-option-${subIndex}`">
                                            {{ subOption.name }} <template v-if="subOption.price">: (${{ subOption.price }})</template>
                                        </li>
                                    </ul>
                                </template>
                            </template>
                            <template v-else>
                                {{ option }} : {{ item.options[option].name }} (${{
                                    item.options[option].price
                                }})
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-3"/>
            <div class="d-flex justify-content-between">
                <span>Order Total</span>
                <span>${{ orderData.total }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { loadStripe } from "@stripe/stripe-js";
export default {
    layout: "main",
    data: function () {
        return {
            success: false
        };
    },
    mounted: function () {
        this.$store.dispatch("cart/clear", {});
    },
    computed: {
        ...mapGetters({ orderData: "order/data" }),
        pickupDate() {
            return new Date(this.orderData.orderData.delivery.pickupDate).toDateString()
        },
        deliveryDate() {
            return new Date(this.orderData.orderData.delivery.deliveryDate).toDateString()
        }
    },
    methods: {
        isArray(option) {
            return option instanceof Array
        },
    }
};
</script>
