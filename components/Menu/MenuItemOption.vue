<template>
    <b-card class="p-0" no-body>
        <b-card-header class="row align-items-center no-gutters px-4">
            <b-form-input
                class="col-6 col-md-3 pl-2"
                v-model="value.name"
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
                        <span
                            v-b-tooltip.hover
                            title="Item price dictated by choice"
                        >
                            <font-awesome-icon
                                icon="info-circle"
                            ></font-awesome-icon>
                        </span>
                    </b-form-radio>
                    <b-form-radio
                        v-model="value.optionType"
                        :name="`type-radio-${_uid}`"
                        value="multiple"
                        >Customer Selects Multiple
                        <span
                            v-b-tooltip.hover.top
                            title="Price of choice added to base price"
                        >
                            <font-awesome-icon
                                icon="info-circle"
                            ></font-awesome-icon>
                        </span>
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
                        v-model="choice.name"
                        placeholder="Choice Name"
                        required
                    ></b-form-input>
                    <b-form-input
                        class="col-3 ml-3"
                        size="sm"
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
    props: ["value"],
    methods: {
        addChoice() {
            let choices = this.value?.choices;
            if (!choices) {
                choices = [];
            }

            choices.push({ name: "", price: "" });
            Vue.set(this.value, "choices", choices);
        },
    },
    watch: {
        value: {
            handler: function () {
                this.$emit("input", this.value);
            },
            deep: true,
        },
    },
};
</script>