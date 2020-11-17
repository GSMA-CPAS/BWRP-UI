<template>
  <v-col>
    <row type="secondary" label="Regular Human Traffic / Exceptional Traffic" />
    <div v-for="service in services" :key="`${service} exceptional`">
      <discount-picker :service="service"></discount-picker>
    </div>
    <row type="secondary" label="Non Exceptional Traffic" />
    <div
      v-for="service in exceptionalTrafficServices"
      :key="`${service} non-exceptional`"
    >
      <discount-picker :service="service"></discount-picker>
    </div>
    <row type="secondary" label="Overall Revenue Commitment" />
    <overall-revenue-commitment />
    <row type="secondary" label="Additional Comments" />
    <additional-comments />
  </v-col>
</template>
<script>
import { mapState } from "vuex";
import DiscountPicker from "./discount-form-components/DiscountPicker.vue";
import OverallRevenueCommitment from "./discount-form-components/OverallRevenueCommitment.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";
export default {
  name: "discount-form",
  description: "description",
  components: {
    AdditionalComments,
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