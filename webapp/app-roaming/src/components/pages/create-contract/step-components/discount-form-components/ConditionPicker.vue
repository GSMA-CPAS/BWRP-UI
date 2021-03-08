<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedConditionName"
          :items="conditions"
          placeholder="Select Condition"
        />
      </v-col>
    </v-row>
    <component
      v-if="!disabledModel"
      :is="condition"
      v-model="selectedCondition"
      :default-currency="defaultCurrency"
    />
  </div>
</template>
<script>
export default {
  name: 'condition-picker',
  description: 'description',
  data() {
    return {selectedConditionName: null, selectedCondition: null};
  },
  components: {},
  props: ['service', 'value', 'defaultCurrency'],
  watch: {
    selectedCondition: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    selectedConditionName: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
  },
  computed: {
    condition() {
      let path = null;
      switch (this.selectedConditionName) {
        case 'Contract Revenue Commitment':
          path = 'ContractRevenueCommit';
          break;
        case 'Deal Revenue Commitment':
          path = 'DealRevenueCommit';
          break;
        default:
          path = this._.upperFirst(
            this._.camelCase(this.selectedConditionName),
          );
      }
      const models = require.context(`./conditions/`, false, /.(vue)$/);
      return models(`./${path}.vue`).default;
    },
    disabledModel() {
      return this.selectedConditionName === null;
    },
    conditions() {
      return [
        'Unconditional',
        'Contract Revenue Commitment',
        'Deal Revenue Commitment',
      ];
    },
  },
  mounted() {
    if (this.value) {
      this.selectedConditionName = this.value.selectedConditionName;
      this.selectedCondition = this.value.selectedCondition;
    }
  },
};
</script>
