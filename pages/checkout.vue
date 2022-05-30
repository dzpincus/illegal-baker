<template>
    <div class="h-100 mh-100 container px-0 bg-info shadow">
        <div
            class="row no-gutters m-3 h-100"
            style="overflow-y: scroll"
            v-if="Object.keys(cart).length > 0"
        >
            <div
                class="col-12 col-md-6 order-1 order-md-0 accordion"
                role="tablist"
            >
                <b-card
                    v-for="(section, index) in sections"
                    :key="`section-${index}`"
                    no-body
                    class="mb-2"
                    style="overflow: visible"
                    bg-variant="secondary"
                >
                    <template #header>
                        <div
                            block
                            variant="link"
                            class="text-left text-dark"
                            :class="{ isClickable: section.canContinue }"
                            @click="clickSection(section)"
                        >
                            <h3>{{ section.title }}</h3>
                        </div>
                    </template>
                    <b-collapse
                        :visible="true"
                        accordion="sections-accordion"
                        role="tabpanel"
                        :id="`collapse-section-${index}`"
                        v-model="section.visible"
                    >
                        <b-card-body>
                            <template
                                :ref="`section-${index}-component`"
                            ></template>
                            <component
                                @canContinue="
                                    (value) => (section.canContinue = value)
                                "
                                v-model="orderData"
                                :is="section.component"
                                :active="section.visible"
                                :ref="section.component + 'Component'"
                            />
                            <b-button
                                @click="showSection(sections[index + 1])"
                                :disabled="!section.canContinue"
                                v-if="!section.hideContinue"
                                class="mt-4"
                                variant="primary"
                                block
                                >Continue</b-button
                            >
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>
            <b-card
                bg-variant="secondary"
                class="
                    col-12
                    offset-md-1
                    col-md-5
                    order-0 order-md-1
                    mb-md-0 mb-4
                "
            >
                <h3>Your Order</h3>
                <CartList formId="checkout-form" :hide-header="true" />
            </b-card>
        </div>
        <div v-else class="pt-5 flex-center">
            <b-card body-class="text-center">
                <h4>Your cart is currently empty</h4>
                <b-button to="/order" variant="primary"
                    >Continue Shopping</b-button
                >
            </b-card>
        </div>
    </div>
</template>


<script>
import { mapGetters } from "vuex";
export default {
    layout: "main",
    head() {
        return {
            script: [
                {
                    src: `https://maps.googleapis.com/maps/api/js?key=${process.env.googlePlacesKey}&libraries=places`,
                },
                { src: "https://js.stripe.com/v3" },
            ],
        };
    },
    methods: {
        showSection(section) {
            section.visible = true;
        },
        clickSection(section) {
            let index = this.sections.indexOf(section);
            let previousSection = this.sections[(index = 1)];
            if (
                (index == 0 && section.canContinue) ||
                previousSection.canContinue
            ) {
                section.visible = !section.visible;
            }
        },
    },
    computed: {
        ...mapGetters({ cart: "cart/items" }),
    },
    data: function () {
        return {
            sections: [
                {
                    title: "Delivery Method",
                    shown: false,
                    component: "CheckoutDelivery",
                    visible: true,
                    canContinue: false,
                },
                {
                    title: "Contact Info",
                    shown: false,
                    component: "CheckoutContactInfo",
                    visible: false,
                    canContinue: false,
                },
                {
                    title: "Payment",
                    shown: false,
                    component: "CheckoutPayment",
                    visible: false,
                    canContinue: false,
                },
                {
                    title: "Review",
                    shown: false,
                    component: "CheckoutReview",
                    visible: false,
                    hideContinue: true,
                },
            ],
            orderData: {},
        };
    },
};
</script>
