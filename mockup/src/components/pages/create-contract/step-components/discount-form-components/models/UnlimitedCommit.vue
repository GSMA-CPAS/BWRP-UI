<template>
  <v-row>
    <disabled-condition placeholder="Commitment" />
    <disabled-threshold />
    <v-col>
      <v-text-field label="Rate" placeholder="N/A" disabled />
    </v-col>
    <revenue-commitment-checkbox v-model="revenueCommitment" />
  </v-row>
</template>

<script>
import RevenueCommitmentCheckbox from "../model-components/RevenueCommitmentCheckbox";
import DisabledThreshold from "../model-components/DisabledThreshold.vue";
import DisabledCondition from "../model-components/DisabledCondition.vue";
export default {
  name: "unlimited-commit",
  model: "Unlimited Commit",
  data() {
    return { revenueCommitment: false };
  },
  components: {
    DisabledCondition,
    DisabledThreshold,
    RevenueCommitmentCheckbox,
  },
};
</script>

<style>
</style>