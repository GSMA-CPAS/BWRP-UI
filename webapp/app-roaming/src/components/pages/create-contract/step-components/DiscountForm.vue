<template>
  <v-col>
    <row type="secondary" label="Condition"></row>
    <condition-picker v-model="condition"/>
    <v-row>
      <!-- Spacer row for visual space --><br><br>
    </v-row>
    <row type="secondary" label="Services"></row>
    <fragment v-for="(service, index ) in chosenServices" :key="service.id">
      <v-row>
        <v-col>
          <v-select
            v-model="service.name"
            :items="services"
            placeholder="Select Service"
          />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button
            :disabled="isDisabled"
            @button-pressed="removeService(index)"
            :svg="icons.remove"
            icon
          />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button @button-pressed="addService" :svg="icons.add" icon />
        </v-col>
      </v-row>
      <row label="TADIGs">
        <v-col>
          <v-text-field v-model="service.tadigs" label="TADIGs" placeholder="All (Default)" />
        </v-col>
      </row>
      <row label="Pricing Model">
        <v-col>
          <v-select
            :items="['Normal','Balanced/Unbalanced']"
            placeholder="Select Service"
            v-model="service.pricingModel"
          />
        </v-col>
      </row>
      <row v-if="service.pricingModel === 'Normal'" label="Rate">
        <rating-plan-input v-model="service.rate"/>
      </row>
      <row v-if="service.pricingModel === 'Balanced/Unbalanced'" label="Balanced Rate">
        <rating-plan-input v-model="service.balancedRate"/>
      </row>
      <row v-if="service.pricingModel === 'Balanced/Unbalanced'" label="Unbalanced Rate">
        <rating-plan-input v-model="service.unbalancedRate"/>
      </row>
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
import { mapState } from "vuex";
import {duplicateMixin} from "@/utils/mixins/component-specfic";
import RatingPlanInput from "./discount-form-components/RatingPlanInput";
import ConditionPicker from "./discount-form-components/ConditionPicker";
/*import DiscountPicker from "./discount-form-components/DiscountPicker.vue";
import OverallRevenueCommitment from "./discount-form-components/OverallRevenueCommitment.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";
import CurrencyForAllDiscounts from "./discount-form-components/CurrencyForAllDiscounts.vue";
import TadigCodes from "./discount-form-components/TadigCodes.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";*/
export default {
  name: "discount-form",
  description: "description",
  mixins: [duplicateMixin],
  components: {
    RatingPlanInput,
    ConditionPicker
    /*AdditionalComments,
    TadigCodes,
    CurrencyForAllDiscounts,
    OverallRevenueCommitment,
    DiscountPicker,*/
  },
  data() {
    return {
      condition: null,
      chosenServices: [
        {
          id: "service-0",
          name: null,
          rate: null,
          balancedRate: null,
          unbalancedRate: null
        },
      ],
    };
  },
  watch: {
    chosenServices: {
      handler() {
        this.$emit("input", this.$data);
      },
      deep: true,
    },
    condition: {
      handler() {
        this.$emit("input", this.$data);
      },
      deep: true,
    },
  },
  methods: {
    addService() {
      this.chosenServices.push({
        id: `service-${this.chosenServices.length}`,
        name: null,
      });
    },
    removeService(index) {
      this.chosenServices.splice(index, 1);
    }
  },
  computed: {
    ...mapState(["services"]),
    isDisabled() {
      return this.chosenServices.length === 1;
    },
  },
};
</script>