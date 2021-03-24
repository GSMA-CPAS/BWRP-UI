<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedConditionName"
          :items="conditions"
          placeholder="Select Condition"
          :error-messages="conditionNameError"
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
import ConditionFormValidations from '@validation/ConditionForm';
import {mapMutations} from 'vuex';
export default {
  name: 'condition-picker',
  description: 'description',
  data() {
    return {selectedConditionName: null, selectedCondition: null};
  },
  components: {},
  ...ConditionFormValidations,
  props: ['from', 'service', 'value', 'defaultCurrency'],
  watch: {
    selectedCondition: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    selectedConditionName: {
      handler() {
        this.updateValidation({
          key: `conditionName${this.from}`,
          isInvalid: this.$v.$invalid,
        });
        this.$emit('input', this.$data);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('document/new', ['addValidation', 'updateValidation']),
  },
  computed: {
    conditionNameError() {
      const errors = [];
      if (!this.$v.selectedConditionName.$dirty) return errors;
      !this.$v.selectedConditionName.required &&
        errors.push(`Condition name is required`);
      return errors;
    },
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
  beforeMount() {
    this.addValidation({
      key: `conditionName${this.from}`,
      step: 'Discount Models',
      from: this.from,
      isInvalid: this.$v.$invalid,
      message: `Condition name is missing`,
      validate: this.$v.$touch,
    });
    if (this.value) {
      this.selectedConditionName = this.value.selectedConditionName;
      this.selectedCondition = this.value.selectedCondition;
    }
  },
};
</script>
