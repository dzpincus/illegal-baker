<template>
    <div>
        <b-form-group :label="option.name" v-slot="{ ariaDescribedby }">
            <b-form-select
                class="w-50"
                v-if="option.optionType == 'one'"
                :required="option.priceModel == 'set'"
                v-model="selected"
                :options="choices"
                :aria-describedby="ariaDescribedby"
                :name="option.name"
            ></b-form-select>
            <b-form-checkbox-group
                v-else
                :options="choices"
                v-model="selected"
                :aria-describedby="ariaDescribedby"
                :name="option.name"
            ></b-form-checkbox-group>
        </b-form-group>
    </div>
</template>

<script>
export default {
    props: ["option", "value"],
    data: function () {
        let selectedStarterValue =
            this.option.optionType === "one"
                ? this.option.priceModel === "set"
                    ? this.choiceValue(this.option.choices[0]).value
                    : null
                : [];
        this.$emit("input", selectedStarterValue);

        return {
            selected: selectedStarterValue,
        };
    },
    watch: {
        selected: function (newValue, oldValue) {
            this.$emit("input", newValue);
        },
    },
    computed: {
        choices: function () {
            return this.option.choices.map((choice) => {
                return this.choiceValue(choice);
            });
        },
    },
    methods: {
        choiceValue: function (choice) {
            let price = " ";
            if (this.option.priceModel) {
                price += "(";
                if (this.option.optionType === "multiple") {
                    price += "+";
                }
                price += `$${choice.price})`;
            }
            return {
                text: `${choice.name}${price}`,
                value: { name: choice.name, price: choice.price },
            };
        },
    },
};
</script>