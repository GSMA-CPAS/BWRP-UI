<template>
  <v-select v-model="selectedCurrency" :items="availableCurrencies" label="Select Currency" />
</template>
<script>
export default {
  name: "currency-selector",
  description: "This is custom currency selector",
  data() {
    return {
      availableCurrencies: ["EUR", "USD", "GBP", "JPY", "CNY"],
      currencyLabel: "Select Currency",
    };
  },
  // inject: ["currencyValidator"],
  props: { value: String },
  computed: {
    selectedCurrency: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    errorMessages() {
      const errors = [];
      if (!this.currencyValidator.$dirty) return errors;
      !this.currencyValidator.required &&
        errors.push(`Please select a currency`);
      return errors;
    },
  },
};
</script>