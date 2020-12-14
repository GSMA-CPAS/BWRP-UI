<template>
  <fragment>
    <v-row>
      <v-col>
        Discounts will be active if the TAP charges will be at least as high as
        the value below.
      </v-col>
    </v-row>
    <revenue-commitment-input v-model="revenueCommitment" />
  </fragment>
</template>

<script>
import RevenueCommitmentInput from '../condition-components/RevenueCommitmentInput';

export default {
  name: 'contract-revenue-commit',
  model: 'Contract Revenue Commitment',
  props: ['value'],
  data() {
    return {revenueCommitment: null};
  },
  watch: {
    revenueCommitment: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
  components: {
    RevenueCommitmentInput,
  },
  beforeMount() {
    this.revenueCommitment = this.value;
  },
};
</script>

<style>
</style>
