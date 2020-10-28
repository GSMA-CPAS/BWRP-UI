<template>
  <v-col>
    <secondary-row label="Regular Human Traffic / Exceptional Traffic" />
    <div v-for="service in services" :key="`${service} exceptional`">
      <discount-picker :service="service"></discount-picker>
    </div>
    <secondary-row label="Non Exceptional Traffic" />
    <div
      v-for="service in exceptionalTrafficServices"
      :key="`${service} non-exceptional`"
    >
      <discount-picker :service="service"></discount-picker>
    </div>
    <secondary-row label="Overall Revenue Commitment" />
    <overall-revenue-commitment />
    <secondary-row label="Currency for all Discounts" />
    <currency-for-all-discounts />
    <secondary-row label="TADIG Codes" />
    <tadig-codes />
    <secondary-row label="Additional Comments" />
    <additional-comments />
  </v-col>
</template>
<script>
import { mapState } from "vuex";
import DiscountPicker from "./discount-form-components/DiscountPicker.vue";
import OverallRevenueCommitment from "./discount-form-components/OverallRevenueCommitment.vue";
import CurrencyForAllDiscounts from "./discount-form-components/CurrencyForAllDiscounts.vue";
import TadigCodes from "./discount-form-components/TadigCodes.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";
export default {
  name: "discount-form",
  description: "description",
  components: {
    AdditionalComments,
    TadigCodes,
    CurrencyForAllDiscounts,
    OverallRevenueCommitment,
    DiscountPicker,
  },
  computed: {
    ...mapState(["services"]),
    exceptionalTrafficServices() {
      return ["MOC", "MTC", "SMS", "Data"];
    },
  },
};
</script>