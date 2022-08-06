<template>
    <div>
        <b-form-radio-group
            v-model="formData.orderType"
            :options="orderTypeOptions"
            button-variant="outline-dark"
            size="lg"
            buttons
        ></b-form-radio-group>
        <div v-if="formData.orderType == 'delivery'">
            <b-form-group
                class="pt-2"
            >
                <slot name="label">
                    <label for="address-field">Delivery Address</label>
                    <span
                        v-b-tooltip.hover
                        title="Your address is within our delivery range!">
                    <font-awesome-icon
                            v-if="deliveryValid"
                            icon="circle-check"
                            class="text-primary"
                        ></font-awesome-icon>
                    </span>
                </slot>
                <b-input
                    id="address-field"
                    v-model="formData.deliveryAddress"
                    class="input"
                    ref="addressField"
                />
            </b-form-group>
            <b-form-textarea
                v-model="formData.deliveryInstructions"
                placeholder="Apartment number, specific instructions, etc..."
                rows="2"
                max-rows="6"
            ></b-form-textarea>
            <label class="pt-2" for="delivery-date-field">Requested Delivery Date</label>
            <b-form-datepicker
                dropup
                id="delivery-date-field"
                :min="minDate"
                v-model="formData.deliveryDate"
                class="mb-2"
            ></b-form-datepicker>
            <div v-if="formData.deliveryAddress && !deliveryValid">
                Your address is outside our delivery radius. If you would like
                to arrange a special delivery, please contact us at
                <a href="mailto:amy@illegalbaker.com?subject=Special Delivery"
                    >amy@illegalbaker.com</a
                >
            </div>
        </div>
        <div class="mt-2" v-else>
            <b-form-group label="Pickup Location">
                <b-form-radio
                    v-model="formData.selectedPickupLocation"
                    v-for="(location, index) in orderSettings.pickupLocations"
                    :key="`pickup-location-${index}`"
                    :name="location.address"
                    :value="location.address"
                    >{{ location.address }}</b-form-radio
                >
            </b-form-group>
            <label for="pickup-date-field">Choose a pickup date</label>
            <b-form-datepicker
                dropup
                id="pickup-date-field"
                :min="minDate"
                v-model="formData.pickupDate"
                class="mb-2"
            ></b-form-datepicker>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    props: ["value"],
    mounted: function () {
        var input = this.$refs.addressField;
        if (input) {
            this.addressAutocomplete = new this.$google.maps.places.Autocomplete(
                input.$el,
                {
                    fields: [
                        "address_components",
                        "geometry",
                        "formatted_address",
                    ],
                }
            );
            this.addressAutocomplete.addListener(
                "place_changed",
                this.addressSelected
            );
        }
    },
    computed: {
        ...mapGetters({ orderSettings: "order-settings/data" }),
        canContinue() {
            if (this.formData.orderType == "delivery") {
                return this.deliveryValid;
            } else {
                return (
                    Boolean(this.formData.selectedPickupLocation) &&
                    Boolean(this.formData.pickupDate)
                );
            }
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
                data["delivery"] = {
                    type: this.formData.orderType,
                    deliveryAddress: this.formData.deliveryAddress,
                    deliveryInstructions: this.formData.deliveryInstructions,
                    pickupDate: this.formData.pickupDate,
                    selectedPickupLocation:
                    this.formData.selectedPickupLocation,
                    deliveryDate: this.formData.deliveryDate
                };
                this.$emit("input", data);
            },
        },
    },
    data: function () {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        return {
            orderTypeOptions: [
                { text: "Delivery", value: "delivery" },
                { text: "Pickup", value: "pickup" },
            ],
            addressAutocomplete: "",
            formData: {
                orderType: "delivery",
                deliveryAddress: "",
                deliveryInstructions: "",
                pickupDate: null,
                selectedPickupLocation: null,
                deliveryDate: null
            },
            deliveryValid: false,
            minDate: minDate,
        };
    },
    methods: {
        addressSelected() {
            let origins = [];
            this.orderSettings.deliveryLocations.forEach((location) => {
                origins.push(
                    new this.$google.maps.LatLng(
                        location.latitude,
                        location.longitude
                    )
                );
            });
            let destinationPlace = this.addressAutocomplete.getPlace();
            let destination = new this.$google.maps.LatLng(
                destinationPlace.geometry.location.lat(),
                destinationPlace.geometry.location.lng()
            );
            var service = new this.$google.maps.DistanceMatrixService();
            var self = this;
            service.getDistanceMatrix(
                {
                    origins: origins,
                    destinations: [destination],
                    travelMode: "DRIVING",
                },
                function (response, status) {
                    let valid = false;
                    for (var i = 0; i < response.rows.length; i++) {
                        // Convert miles to meters
                        let meterRadius =
                            parseInt(
                                self.orderSettings.deliveryLocations[i].radius
                            ) * 1609.34;
                        if (
                            response.rows[i].elements[0].distance.value <=
                            meterRadius
                        ) {
                            valid = true;
                        }
                    }
                    self.deliveryValid = valid;
                }
            );
        },
    },
};
</script>
