<template>
  <v-row>
      <v-col>
        <v-currency-field v-model="commitmentValue" label="Value"/>
      </v-col>
      <v-col>
        <currency-selector v-model="currency" label="Currency"/>
      </v-col>
      <v-col>
        <v-checkbox label="Including Taxes?" v-model="includingTaxes"/>
      </v-col>
    </v-row>
</template>
<script>
import CurrencySelector from '@/components/global-components/CurrencySelector';
export default {
  name: 'revenue-commitment-input',
  components: {CurrencySelector},
  description: 'description',
  props: ['value'],
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
        this.$emit('input', this.$data);
      },
      deep: true,
    },
  },
  beforeMount() {
    if ( this.value ) {
      this.includingTaxes = this.value.includingTaxes;
      this.commitmentValue = this.value.commitmentValue;
      this.currency = this.value.currency;
    }
  },
};
</script>
