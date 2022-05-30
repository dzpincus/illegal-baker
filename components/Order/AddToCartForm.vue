<template>
    <b-modal
        :title="editItem ? 'Update item' : 'Add to cart'"
        centered
        size="lg"
        :id="id"
        footer-class="d-none"
    >
        <div class="row no-gutters" v-if="currentMenuItem">
            <div class="col-12 col-md-5">
                <CloudinaryImage :image="image" />
            </div>
            <div class="col-12 col-md-7 pl-md-4">
                <b-form
                    @submit.prevent="submit"
                    class="d-flex flex-column w-75"
                >
                    <h3>{{ currentMenuItem.name }}</h3>
                    <h4>${{ price }}</h4>
                    <p>{{ currentMenuItem.description }}</p>

                    <b-form-group label="Quantity" label-for="quantity">
                        <b-input
                            class="w-25"
                            id="quantity"
                            v-model="quantity"
                            min="1"
                            type="number"
                        ></b-input>
                    </b-form-group>
                    <OrderOptionInput
                        v-model="selectedOptions[option.name]"
                        v-for="(option, index) in currentMenuItem.options"
                        :key="`menuItem-${currentMenuItem.name}-${index}`"
                        :option="option"
                    >
                    </OrderOptionInput>
                    <b-form-group
                        label="Special Requests"
                        label-for="special-requests-input"
                    >
                        <b-form-textarea
                            id="textarea"
                            v-model="specialRequests"
                            max-rows="6"
                        ></b-form-textarea>
                    </b-form-group>
                    <b-button variant="primary" type="submit">
                        <span v-if="editItem">Update</span>
                        <span v-else>Add to cart</span>
                    </b-button>
                </b-form>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import { v4 as uuidv } from "uuid";

export default {
    props: ["id", "menuItem", "editItem"],
    data: function () {
        return {
            price: this.currentMenuItem?.price,
            selectedOptions: {},
            quantity: 1,
            specialRequests: "",
        };
    },
    watch: {
        menuItem: {
            deep: true,
            handler: function () {
                if (!this.editItem) {
                    if (this.menuItem?.options) {
                        let options = this.menuItem.options.map((option) => {
                            let opt = {};
                            opt[option.name] = null;
                            return opt;
                        });
                        if (options.length) {
                            this.selectedOptions = Object.assign(...options);
                        }
                    }
                    this.quantity = 1;
                    this.price = this.menuItem.price;
                }
            },
        },
        editItem: {
            deep: true,
            handler: function () {
                this.price = this.editItem.price;
                this.selectedOptions = JSON.parse(
                    JSON.stringify(this.editItem.options)
                );
                this.quantity = this.editItem.quantity;
                this.specialRequests = this.editItem.specialRequests;
            },
        },
        selectedOptions: {
            deep: true,
            handler: function () {
                if (this.selectedOptions) {
                    let basePrice = this.price;
                    let adds = 0;
                    this.currentMenuItem.options.forEach((option) => {
                        let optionValue = this.selectedOptions[option.name];
                        if (optionValue && option.priceModel != "none") {
                            if (option.priceModel == "set") {
                                basePrice = parseFloat(optionValue.price);
                            } else if (option.optionType == "one") {
                                adds += parseFloat(optionValue.price);
                            } else {
                                Object.values(optionValue).forEach((value) => {
                                    adds += parseFloat(value.price);
                                });
                            }
                        }
                    });
                    this.price = basePrice + adds;
                }
            },
        },
    },
    computed: {
        ...mapGetters({ images: "image/all", menuItems: "menu-item/all" }),
        image: function () {
            return this.images[this.currentMenuItem.image];
        },
        currentMenuItem: function () {
            if (this.editItem) {
                return this.menuItems[this.editItem.menuItem];
            } else {
                return this.menuItem;
            }
        },
    },
    methods: {
        submit() {
            let id = this.editItem ? this.editItem.id : uuidv();
            let data = {
                id: id,
                menuItem: this.currentMenuItem.id,
                quantity: parseInt(this.quantity),
                price: this.price,
                options: JSON.parse(JSON.stringify(this.selectedOptions)),
                specialRequests: this.specialRequests,
            };
            if (this.editItem) {
                let payload = {
                    data: data,
                    id: id,
                };
                this.$store.dispatch("cart/update", payload);
            } else {
                this.$store.dispatch("cart/add", data);
            }
            this.$root.$emit("bv::hide::modal", this.id);
        },
    },
};
</script>