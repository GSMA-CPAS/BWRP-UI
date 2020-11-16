<template>
  <fragment>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedCondition"
          :items="conditions"
          placeholder="Select Condition"
        />
      </v-col>
    </v-row>
    <component v-if="!disabledModel" :is="condition" />
  </fragment>
</template>
<script>
export default {
  name: "condition-picker",
  description: "description",
  data() {
    return { selectedCondition: null };
  },
  components: {
  },
  props: { service: { type: String, default: "missing service" } },
  methods: {
    checkModel(selectedModel) {
      return this.selectedCondition === selectedModel;
    },
  },
  computed: {
    condition() {
      var path = null;
      switch (this.selectedCondition) {
        case 'Contract Revenue Commitment':
          path = 'ContractRevenueCommit';
          break;
        case 'Deal Revenue Commitment':
          path = 'DealRevenueCommit';
          break;
        default:
          path = this._.upperFirst(this._.camelCase(this.selectedCondition));
      }
      const models = require.context(`./conditions/`, false, /.(vue)$/);
      return models(`./${path}.vue`).default;
    },
    disabledModel() {
      return (
        this.selectedCondition === null || this.selectedCondition === "No Discount"
      );
    },
    conditions() {
      return [
          "Unconditional",
          "Contract Revenue Commitment",
          "Deal Revenue Commitment",
      ];
    },
  },
};
</script>