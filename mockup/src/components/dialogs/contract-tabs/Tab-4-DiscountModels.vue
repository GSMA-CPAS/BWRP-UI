<template>
  <fragment>
    <parties-header :sub-row-labels="labels" />
    <secondary-row class="pa-4" label="Regular Human Traffic / Exceptional Traffic" />
    <v-divider />
    <row cols="2" v-for="(data,index) in  testData" :key="`row-${index}`" :label="data.service">
      <component :is="renderModel(data.model)" :data="data" />
    </row>
    <v-divider />
    <secondary-row class="pa-4" label="Non Exceptional Traffic" />
    <v-divider />
    <row cols="2" v-for="(data,index) in  testData2" :key="index" :label="data.service">
      <component :is="renderModel(data.model)" :data="data" />
    </row>
    <v-divider />
    <secondary-row class="pa-4" label="Other information" />
    <v-divider />
    <v-row align="baseline" class="text-center">
      <v-col cols="2" />
      <v-divider vertical></v-divider>
      <v-col>
        <v-row class="font-weight-medium">
          <v-col v-for="{label,key} in otherInformationLabels" :key="key">{{label}}</v-col>
        </v-row>
        <v-row>
          <v-col>5000 EUR</v-col>
          <v-col>EUR</v-col>
          <v-col>CODE 1, CODE 2, CODE 3, CODE 4, CODE 5, CODE 6, CODE 7</v-col>
          <v-col>someComment</v-col>
        </v-row>
      </v-col>
    </v-row>
  </fragment>
</template>
<script>
import { mapState } from "vuex";
import PartiesHeader from "../components/PartiesHeader.vue";
import { utilsMixin } from "../../../utils/mixins/handle-data";
export default {
  name: "tab-4",
  label: "Discount Models",
  description: "description",
  mixins: [utilsMixin],
  data() {
    return {};
  },
  components: {
    PartiesHeader,
  },
  props: {},
  watch: {},
  methods: {
    renderModel(model) {
      var path = null;
      switch (model) {
        case "Flat IOT":
          path = "FlatIOT";
          break;
        case "Baselines Incremental":
        case "Baselines Non-Incremental":
          path = "Baseline";
          break;
        default:
          path = this._.upperFirst(this._.camelCase(model));
      }
      const models = require.context(`./models/`, false, /.(vue)$/);
      return models(`./${path}.vue`).default;
    },
  },
  computed: {
    otherInformationLabels() {
      const otherInformationLabels = [
        "Overall Revenue Commitment",
        "Currency for all Discounts",
        "TADIG Codes",
        "Additional Comments",
      ];
      return this.labelsToCamelCase(otherInformationLabels);
    },
    labels() {
      const discountModelsLabels = [
        "Model",
        "Increment",
        "Threshold",
        "Rate",
        "Revenue Commitment",
      ];
      return this.labelsToCamelCase(discountModelsLabels);
    },
    ...mapState("contract", ["discountModels"]),
    overallRevenueCommitment() {
      return { amount: 10000, currency: "EUR" };
    },
    testData() {
      return [
        {
          service: "MOC",
          model: "Flat IOT",
          increment: "60 sec",
          rate: 0,
          revenueCommitment: true,
        },
        {
          service: "MOC Local",
          model: "Balanced / Unbalanced",
          increment: "1 sec",
          balanced: { rate: 0, revenueCommitment: true },
          unbalanced: { rate: 0, revenueCommitment: false },
        },
        {
          service: "MOC Back Home",
          model: "Baselines Incremental",
          increment: "AA14",
          baselines: [
            { from: 0, to: 500, rate: 0.2, revenueCommitment: false },
            { from: 500, to: Infinity, rate: 0.1, revenueCommitment: false },
          ],
        },
        {
          service: "MOC EU/EEA",
          model: "Baselines Non-Incremental",
          increment: "1 sec",
          baselines: [
            { from: 0, to: 600, rate: 0.25, revenueCommitment: true },
            { from: 600, to: Infinity, rate: 0.125, revenueCommitment: false },
          ],
        },
        {
          service: "MOC RoW",
          model: "Revenue Commit",
          increment: "60 sec",
          threshold: 10000,
          rate: 0.1,
          revenueCommitment: true,
        },
        {
          service: "Data",
          model: "Unlimited Commit",
          increment: "60 sec",
          revenueCommitment: false,
        },
      ];
    },
    testData2() {
      return [
        {
          service: "MOC",
          model: "Flat IOT",
          increment: "60 sec",
          rate: 0,
          revenueCommitment: true,
        },
        {
          service: "Data",
          model: "Unlimited Commit",
          increment: "60 sec",
          revenueCommitment: false,
        },
      ];
    },
  },
  mounted() {},
};
</script>