<template>
  <v-row>
    <v-col>
      <v-currency-field v-model="commitmentValue" label="Value" />
    </v-col>
    <v-col>
      <currency-selector v-model="currency" label="Currency" />
    </v-col>
    <v-col>
      <v-checkbox label="Including Taxes?" v-model="includingTaxes" />
    </v-col>
  </v-row>
</template>
<script>
import CurrencySelector from '@/components/global-components/CurrencySelector';
import Vue from 'vue';
export default {
  name: 'revenue-commitment-input',
  components: {CurrencySelector},
  description: 'description',
  props: ['value', 'defaultCurrency'],
  data() {
    return {
      includingTaxes: false,
      commitmentValue: null,
      currency: null,
    };
  },
  watch: {
    includingTaxes: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    value: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    currency: {
      handler() {
        if (this.$data.currency !== this.defaultCurrency) {
          if (
            !confirm(
              'The currency for the revenue commitment differs from the contract currency. Are you sure?',
            )
          ) {
            Vue.nextTick(() => (this.$data.currency = this.defaultCurrency));
          }
        }
        this.$emit('input', this.$data);
      },
      deep: true,
    },
  },
  mounted() {
    if (this.value) {
      this.includingTaxes = this.value.includingTaxes;
      this.commitmentValue = this.value.value;
      this.currency = this.value.currency;
    } else {
      this.currency = this.defaultCurrency;
    }
  },
};
</script>
