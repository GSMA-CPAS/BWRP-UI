<template>
  <div>
    <row type="secondary" label="Currency for all Discounts" />
    <currency-for-all-discounts v-model="value.currencyForAllDiscounts" />
    <row type="secondary" label="TADIG Codes" />
    <tadig-codes v-model="value.tadigCodes" />
  </div>
</template>
<script>
import TadigCodes from '../general-information/TadigCodes.vue';
import CurrencyForAllDiscounts from '../general-information/CurrencyForAllDiscounts.vue';
export default {
  name: 'general-info-party-form',
  description: 'description',
  mixins: [],
  data: () => ({}),
  components: {
    CurrencyForAllDiscounts,
    TadigCodes,
  },
  props: {value: Object},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>
