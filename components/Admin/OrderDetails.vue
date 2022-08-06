<template>
<b-modal ref="order-details" footer-class="bg-dark" size="lg" :title="`Order #${order ? order.id : ''} Details`">
  <div v-if="order" class="h5">
    <hr class="my-3" />
    <div class="d-flex justify-content-between">
      <span>Customer Name</span>
      <span>{{ order.order_data.contactInfo.name }}</span>
    </div>
    <hr class="my-3" />
    <div class="d-flex justify-content-between">
      <span>Customer Email</span>
      <span>{{ order.order_data.contactInfo.email }}</span>
    </div>
    <hr class="my-3" />
    <div class="d-flex justify-content-between">
      <span>Customer Phone #</span>
      <span>{{ order.order_data.contactInfo.phone }}</span>
    </div>
    <hr class="my-3" />
    <template v-if="order.order_data && order.order_data.delivery.type === 'pickup'">
      <div class="d-flex justify-content-between">
        <span>Pickup Date</span>
        <span>{{ pickupDate }}</span>
      </div>
      <hr class="my-3" />
      <div class="d-flex justify-content-between">
        <span>Pickup Location</span>
        <span class="text-right w-50">{{ order.order_data.delivery.selectedPickupLocation }}</span>
      </div>
    </template>
    <template v-else>
      <div class="d-flex justify-content-between">
        <span>Requested Delivery Date</span>
        <span>{{ deliveryDate }}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Delivery Location</span>
        <span class="text-right w-50">{{ orderData.orderData.delivery.selectedPickupLocation }}</span>
        <br>
        <span v-if="orderData.orderData.delivery.deliveryInstructions" class="text-right w-50">
            {{ orderData.orderData.delivery.deliveryInstructions }}
        </span>
      </div>
    </template>
    <hr class="my-3" />
    <div class="d-flex justify-content-between">
      <span>Payment</span>
      <span v-if="order.order_data && order.order_data.payment.type === 'cash'">Cash on order {{ order.order_data.delivery.type }}</span>
      <a v-else-if="paymentIntent" :href="`https://dashboard.stripe.com/payments/${paymentIntent.id}/`" target="_blank" class="text-capitalize">
        {{ paymentIntent.status }}
      </a>
    </div>
    <hr class="my-3" />
    <div class="d-flex justify-content-between">
      <div class="mr-5">Order Details:</div>
      <div class="d-flex flex-column pb-4">
        <div v-for="item in order.order_items" class="d-flex flex-column">
          <div>{{ item.name }} <span>x {{ item.quantity }}</span></div>
          <div v-if="item.specialRequests" class="small">
            <span class="italic">SPECIAL REQUEST: </span>{{ item.specialRequests }}
          </div>
          <div v-for="(option, index) in Object.keys(item.options)" :key="`${item.name}-option-${index}`" class="small align-self-end">
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
    <hr class="my-3" />
    <div class="d-flex justify-content-between">
      <span>Order Total</span>
      <span>${{ order.total }}</span>
    </div>
  </div>
  <template #modal-footer>
    <div class="d-flex float-right w-25 align-items-center">
      <h4 class="mb-0 text-white">Status:</h4>
      <b-form-select v-model="orderStatus" :options="statusOptions" class="ml-2 text-capitalize" />
    </div>
  </template>
</b-modal>
</template>

<script>
import {
  loadStripe
} from "@stripe/stripe-js";

export default {
  data() {
    return {
      order: null,
      statusOptions: ['new', 'accepted', 'rejected', 'complete'],
      paymentIntent: null
    }
  },
  methods: {
    async show(order) {
      this.order = order;
      if (this.order && this.order.order_data.payment.type === 'stripe') {
        let stripe = await loadStripe(process.env.stripeKey);
        let clientSecret = this.order.order_data.payment.clientSecret;
        const resp = await stripe.retrievePaymentIntent(
          clientSecret
        )
        this.paymentIntent = resp.paymentIntent
      }
      this.$refs["order-details"].show()
    },
    isArray(option) {
      return option instanceof Array
    },
  },
  computed: {
    pickupDate() {
      return new Date(this.order.order_data.delivery.pickupDate).toDateString()
    },
    deliveryDate() {
      return new Date(this.orderData.orderData.delivery.deliveryDate).toDateString()

    },
    orderStatus: {
      get() {
        return this.order.status
      },
      async set(newStatus) {
        if (this.order) {
          document.body.style.cursor = "wait";
          let data = {
            status: newStatus
          }
          await this.$store.dispatch("order/update", {
            id: this.order.id,
            data: data
          }).finally(() => {
            document.body.style.cursor = "default";
          })
        }
      }
    }
  }
}
</script>
