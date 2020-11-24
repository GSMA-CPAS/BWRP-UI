<template>
  <v-col>
    <fragment v-for="(tier, index) in tiers" :key="tier.id">
      <v-row>
        <v-col>
          <v-text-field :disabled="index === 0" v-model="tier.threshold" label="Threshold"/>
        </v-col>
        <v-col>
          <v-text-field v-model="tier.fixedPrice" label="Fixed Price" />
        </v-col>
        <v-col>
          <v-text-field v-model="tier.linearPrice" label="Linear Price" />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button
            :disabled="isDisabled || index === 0"
            @button-pressed="removeTier(index)"
            :svg="icons.remove"
            icon
          />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button @button-pressed="addTier" :svg="icons.add" icon />
        </v-col>
      </v-row>
    </fragment>
  </v-col>
    <!--
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
    -->
</template>
<script>
import {duplicateMixin} from "@/utils/mixins/component-specfic";
/*import DiscountPicker from "./discount-form-components/DiscountPicker.vue";
import OverallRevenueCommitment from "./discount-form-components/OverallRevenueCommitment.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";
import CurrencyForAllDiscounts from "./discount-form-components/CurrencyForAllDiscounts.vue";
import TadigCodes from "./discount-form-components/TadigCodes.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";*/
export default {
  name: "rating-plan-input",
  description: "description",
  mixins: [duplicateMixin],
  components: {
    /*AdditionalComments,
    TadigCodes,
    CurrencyForAllDiscounts,
    OverallRevenueCommitment,
    DiscountPicker,*/
  },
  data() {
    return {
      tiers: [
        {
          id: "tier-0",
          threshold: 0,
        },
      ],
    };
  },
  watch: {
    tiers: {
      handler(val) {
        this.$emit("input", val);
      },
      deep: true,
    },
  },
  methods: {
    addTier() {
      this.tiers.push({
        id: `tier-${this.tiers.length}`,
        name: null,
      });
    },
    removeTier(index) {
      this.tiers.splice(index, 1);
    }
  },
  computed: {
    isDisabled() {
      return this.tiers.length === 1;
    },
  },
};
</script>