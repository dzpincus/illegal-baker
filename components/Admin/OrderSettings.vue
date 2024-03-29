<template>
    <b-form @submit.prevent="submit" class="w-100 w-md-50">
        <client-only>
            <FlashMessage position="right bottom"></FlashMessage>
        </client-only>
        <toggle-button 
            v-model="enabled" 
            :width="130"
            :font-size="12"
            :labels="{checked: 'Orders Enabled', unchecked: 'Orders Disabled'}" 
            color="#280004"/>
        <template v-if="enabled">
            <b-form-group
                label="Addresses to deliver from (used to validate delivery orders)"
                class="pt-2"
            >
                <b-button @click="addPickupLocation()" variant="dark"
                    >Add Pickup Location</b-button
                >
                <div
                    class="pt-3 d-flex justify-content-start"
                    v-for="location in pickupLocations"
                    :key="`pickup-${location.id}`"
                    v-b-hover="hoverHandler"
                >
                    <b-form-group label="Pickup address">
                        <b-input
                            required
                            v-b-tooltip.hover
                            :title="location.address"
                            placeholder="Enter an address"
                            :ref="`pickup-${location.id}`"
                            v-model="location.address"
                        />
                    </b-form-group>
                    <div v-if="isHovered" class="align-self-center pt-3 ml-3">
                        <font-awesome-icon
                            icon="trash"
                            class="pr-2 isClickable"
                            @click="removePickupLocation(location.id)"
                        />
                    </div>
                </div>
            </b-form-group>
            <b-form-group
                label="Addresses to deliver from (used to validate delivery orders)"
                class="pt-2"
            >
                <b-button @click="addDeliveryLocation()" variant="dark"
                    >Add Delivery Location</b-button
                >
                <div
                    class="pt-3 d-flex justify-content-start"
                    v-for="location in deliveryLocations"
                    :key="`delivery-${location.id}`"
                    v-b-hover="hoverHandler"
                >
                    <b-form-group label="Delivery starting point">
                        <b-input
                            required
                            v-b-tooltip.hover
                            :title="location.address"
                            placeholder="Enter an address"
                            :ref="`delivery-${location.id}`"
                            v-model="location.address"
                        />
                    </b-form-group>
                    <b-form-group label="Mile radius to deliver to" class="ml-3">
                        <b-input required type="number" v-model="location.radius" />
                    </b-form-group>
                    <div v-if="isHovered" class="align-self-center pt-3 ml-3">
                        <font-awesome-icon
                            icon="trash"
                            class="pr-2 isClickable"
                            @click="removeDeliveryLocation(location.id)"
                        />
                    </div>
                </div>
            </b-form-group>
        </template>
        <template v-else>
            <b-form-group label="Order Page Message">
                <b-input
                    required
                    placeholder="Enter a message to show while ordering is disabled"
                    v-model="disabledMessage"
                />
            </b-form-group>
        </template>
        <b-button variant="primary" type="submit">Save</b-button>
    </b-form>
</template>

<script>
import { mapGetters } from "vuex";
import { v4 as uuidv } from "uuid";
import Vue from "vue";
export default {
    layout: "main",
    computed: {
        ...mapGetters({ orderSettings: "order-settings/data" }),
    },
    watch: {
        orderSettings: {
            deep: true,
            immediate: true,
            handler: function () {
                if (Object.keys(this.orderSettings).length > 0) {
                    this.deliveryLocations = [];
                    this.orderSettings.deliveryLocations.forEach(
                        (deliveryLocation) => {
                            this.addDeliveryLocation(deliveryLocation);
                        }
                    );
                    this.pickupLocations = [];
                    this.orderSettings.pickupLocations.forEach(
                        (pickupLocation) => {
                            this.addPickupLocation(pickupLocation);
                        }
                    );
                    this.enabled = this.orderSettings.orderingEnabled
                    this.disabledMessage = this.orderSettings.disabledOrderingMessage
                }
            },
        },
    },
    data: function () {
        return {
            isHovered: false,
            addressAutocomplete: null,
            deliveryLocations: [],
            pickupLocations: [],
            enabled: true,
            disabledMessage: ""
        };
    },
    methods: {
        addressSelected(input) {
            let place = this.addressAutocomplete.getPlace();
            if (place) {
                this.pickupLocation = {
                    address: place.formatted_address,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                };
            }
        },
        locationSelected(type, id) {
            let locations =
                type == "pickup" ? "pickupLocations" : "deliveryLocations";
            let autocomplete = this[locations].find(
                (location) => location.id == id
            ).autocomplete;
            let place = autocomplete.getPlace();
            this[locations] = this[locations].map((location) => {
                if (location.id == id) {
                    return {
                        ...location,
                        address: place.formatted_address,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                    };
                } else {
                    return location;
                }
            });
        },
        addPickupLocation(location) {
            this.addLocation("pickup", location);
        },
        addDeliveryLocation(location) {
            this.addLocation("delivery", location);
        },
        addLocation(type, location) {
            if (!location) {
                location = {};
            }
            let locations =
                    type == "pickup" ? "pickupLocations" : "deliveryLocations",
                id = uuidv(),
                data = { ...location, id: id };
            this[locations].push(data);
            Vue.nextTick(function () {
                let ref = `${type}-${id}`;
                let inputs = this.$refs[ref];
                if (inputs && (typeof google !== 'undefined')) {
                    let input = this.$refs[ref][0];
                    let autocomplete = new this.$google.maps.places.Autocomplete(
                        input.$el,
                        {
                            fields: [
                                "address_components",
                                "geometry",
                                "formatted_address",
                            ],
                        }
                    );
                    let self = this;
                    autocomplete.addListener("place_changed", function () {
                        self.locationSelected(type, id);
                    });
                    this[locations] = this[locations].map((location) => {
                        if (location.id == id) {
                            return { ...location, autocomplete: autocomplete };
                        } else {
                            return location;
                        }
                    });
                }
            }, this);
        },
        removePickupLocation(id) {
            this.removeLocation("pickup", id);
        },
        removeDeliveryLocation(id) {
            this.removeLocation("delivery", id);
        },
        removeLocation(type, id) {
            let locations =
                type == "pickup" ? "pickupLocations" : "deliveryLocations";
            this[locations] = this[locations].filter(
                (location) => location.id != id
            );
        },
        hoverHandler(isHovered) {
            this.isHovered = isHovered;
        },
        submit() {
            document.body.style.cursor = "wait";
            let data = {
                pickupLocations: this.pickupLocations.map((location) => {
                    return {
                        address: location.address,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        radius: location.radius,
                    };
                }),
                deliveryLocations: this.deliveryLocations.map((location) => {
                    return {
                        address: location.address,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        radius: location.radius,
                    };
                }),
                orderingEnabled: this.enabled,
                disabledOrderingMessage: this.disabledMessage
            };
            this.$store.dispatch("order-settings/set", data).then(() => {
                this.flashMessage.show({
                    status: 'success',
                    message: 'Settings saved',
                    blockClass: 'flashClass bg-success',
                })
            }).catch((e) => {
                this.flashMessage.show({
                    status: 'error',
                    message: e,
                    blockClass: 'flashClass bg-success',
                })
            }).finally(() => {
                document.body.style.cursor = "default";

            });
        },
    },
};
</script>

<style>

.flashClass {
    width: 150px;
}


</style>