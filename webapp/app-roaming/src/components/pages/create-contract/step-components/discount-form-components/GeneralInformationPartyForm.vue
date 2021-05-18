<template>
  <div>
    <row type="secondary" label="Currency for all Discounts" />
    <currency-for-all-discounts v-model="value.currencyForAllDiscounts" />
    <row type="secondary" label="TADIG Codes" />
    <tadig-codes :excludeTadigs="exludeTadigs" v-model="value.tadigCodes" />
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
  props: {party: String, value: Object},
  watch: {},
  methods: {},
  computed: {
    exludeTadigs() {
      switch (this.party) {
        case 'user':
          return this.$store.state.document.new.generalInformation.partnerData
            .tadigCodes.codes;
        case 'partner':
          return this.$store.state.document.new.generalInformation.userData
            .tadigCodes.codes;
        default:
          return [];
      }
    },
  },
  mounted() {},
};
</script>
