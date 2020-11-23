<template>
  <v-row>
    <disabled-condition placeholder="Commitment" />
    <v-col>
      <v-text-field v-model="threshold" label="Threshold" placeholder="0" />
    </v-col>
    <v-col>
      <v-text-field v-model="rate" label="Rate" placeholder="0" />
    </v-col>
    <revenue-commitment-checkbox v-model="revenueCommitment" />
  </v-row>
</template>

<script>
import RevenueCommitmentCheckbox from '../model-components/RevenueCommitmentCheckbox';
import DisabledCondition from '../model-components/DisabledCondition.vue';

export default {
  name: 'revenue-commit',
  model: 'Revenue Commit',
  data() {
    return {threshold: null, rate: null, revenueCommitment: false};
  },
  components: {
    DisabledCondition,
    RevenueCommitmentCheckbox,
  },
};
</script>
