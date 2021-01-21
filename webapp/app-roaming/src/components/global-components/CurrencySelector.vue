<template>
  <v-select
    v-model="selectedCurrency"
    :items="availableCurrencies"
    label="Select Currency"
  />
</template>
<script>
export default {
  name: 'currency-selector',
  description: 'This is a custom currency selector',
  data() {
    return {
      availableCurrencies: ['EUR', 'USD', 'GBP'],
      currencyLabel: 'Select Currency',
    };
  },
  props: {value: String},
  computed: {
    selectedCurrency: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
