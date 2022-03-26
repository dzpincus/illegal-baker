<template>
    <b-modal
        title="Add to cart"
        centered
        size="lg"
        id="add-to-cart-form"
        footer-class="d-none"
    >
        <div class="row no-gutters" v-if="menuItem">
            <div class="col-12 col-md-5">
                <CloudinaryImage :image="image" />
            </div>
            <div class="col-12 col-md-7 pl-md-4">
                <b-form class="d-flex flex-column w-75">
                    <h3>{{ menuItem.name }}</h3>
                    <h4>${{ price }}</h4>
                    <p>{{ menuItem.description }}</p>

                    <b-form-group label="Quantity" label-for="quantity">
                        <b-input
                            class="w-25"
                            id="quantity"
                            v-model="formData.quantity"
                            min="1"
                            type="number"
                        ></b-input>
                    </b-form-group>
                    <OrderOptionInput
                        v-model="formData.options[option.name]"
                        v-for="(option, index) in menuItem.options"
                        :key="`menuItem-${menuItem.name}-${index}`"
                        :option="option"
                    >
                    </OrderOptionInput>
                    <b-button variant="primary" type="submit"
                        >Add to Cart</b-button
                    >
                </b-form>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: ["menuItem"],
    data: function () {
        return {
            price: this.menuItem?.price,
            formData: {
                quantity: 1,
                options: {},
            },
        };
    },
    watch: {
        menuItem: {
            deep: true,
            handler: function () {
                if (this.menuItem?.options) {
                    let options = this.menuItem.options.map((option) => {
                        let opt = {};
                        opt[option.name] = null;
                        return opt;
                    });
                    if (options.length) {
                        this.formData.options = Object.assign(...options);
                    }
                }
                this.price = this.menuItem.price;
            },
        },
        formData: {
            deep: true,
            handler: function () {
                if (this.formData.options) {
                    let basePrice = this.price;
                    let adds = 0;
                    this.menuItem.options.forEach((option) => {
                        let optionValue = this.formData.options[option.name];
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
        ...mapGetters({ images: "image/all" }),
        image: function () {
            return this.images[this.menuItem.image];
        },
    },
};
</script>