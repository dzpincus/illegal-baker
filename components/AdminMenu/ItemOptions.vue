<template>
    <b-card class="p-0" no-body>
        <b-card-header class="row align-items-center no-gutters px-4">
            <b-form-input
                class="col-6 col-md-3 pl-2"
                v-model="value.name"
                required
                placeholder="Option Name"
            ></b-form-input>
            <a
                href="#"
                class="offset-8 col-1 p-0 text-right"
                @click="$emit('deleteOption')"
            >
                <font-awesome-icon class="pr-1" icon="trash" />
            </a>
        </b-card-header>
        <b-card-body class="px-4 py-0 row no-gutters">
            <div class="py-4 col-3 border-right">
                <b-form-group label="Option Type">
                    <b-form-radio
                        v-model="value.optionType"
                        :name="`type-radio-${_uid}`"
                        value="one"
                    >
                        Customer Selects One
                    </b-form-radio>
                    <b-form-radio
                        v-model="value.optionType"
                        :name="`type-radio-${_uid}`"
                        value="multiple"
                        @change="selectMultiple"
                        >Customer Selects Multiple
                    </b-form-radio>
                </b-form-group>
                <b-form-group label="Price Model">
                    <b-form-radio
                        v-model="value.priceModel"
                        :name="`price-model-radio-${_uid}`"
                        :disabled="
                            optionSetIndex != null && optionSetIndex != index
                        "
                        value="set"
                        @change="selectSet"
                    >
                        Selection sets price
                        <span v-b-tooltip.hover :title="setTooltip">
                            <font-awesome-icon
                                icon="info-circle"
                            ></font-awesome-icon>
                        </span>
                    </b-form-radio>
                    <b-form-radio
                        v-model="value.priceModel"
                        :name="`price-model-radio-${_uid}`"
                        value="add"
                        >Selection adds to price
                    </b-form-radio>
                    <b-form-radio
                        v-model="value.priceModel"
                        :name="`price-model-radio-${_uid}`"
                        value="none"
                        >Selection has no added or modified price
                    </b-form-radio>
                </b-form-group>
            </div>
            <div class="py-4 col-9 pl-4">
                <div
                    v-for="(choice, index) in value.choices"
                    :key="`${value.name}-choice-${index}`"
                    class="row mt-3"
                >
                    <b-form-input
                        class="col-3 ml-3 pl-2"
                        size="sm"
                        :id="`option-${index}-name`"
                        v-model="choice.name"
                        placeholder="Choice Name"
                        required
                    ></b-form-input>
                    <b-form-input
                        v-if="value.priceModel != 'none'"
                        class="col-3 ml-3"
                        size="sm"
                        :id="`option-${index}-price`"
                        v-model="choice.price"
                        placeholder="Choice Price"
                        type="number"
                        required
                    ></b-form-input>
                    <a
                        class="isClickable"
                        @click="value.choices.splice(index, 1)"
                    >
                        <font-awesome-icon
                            size="sm"
                            class="align-middle pl-2"
                            icon="trash"
                        />
                    </a>
                </div>
                <b-button
                    class="mt-3"
                    variant="light"
                    @click.prevent="addChoice"
                >
                    <font-awesome-icon icon="plus" />
                    Add choice to option
                </b-button>
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
import Vue from "vue";
export default {
    props: ["value", "index", "optionSetIndex"],
    computed: {
        setTooltip() {
            if (
                this.optionSetIndex != null &&
                this.optionSetIndex != this.index
            ) {
                return "Only one option can have this option";
            } else {
                return 'Only compatible with "Customer Selects One" Option Type';
            }
        },
    },
    methods: {
        selectSet() {
            if (this.value.optionType == "multiple") {
                this.value.optionType = "one";
            }
            this.value.priceModel = "set";
        },
        selectMultiple() {
            if (this.value.priceModel == "set") {
                this.value.priceModel = "add";
            }
            this.value.optionType = "multiple";
        },
        addChoice() {
            let choices = this.value?.choices;
            if (!choices) {
                choices = [];
            }

            choices.push({
                name: "",
                price: "",
                optionType: "one",
                priceModel: "set",
            });
            Vue.set(this.value, "choices", choices);
        },
    },
    watch: {
        value: {
            handler: function (newValue, oldValue) {
                this.$emit("input", this.value);
            },
            deep: true,
        },
    },
};
</script>