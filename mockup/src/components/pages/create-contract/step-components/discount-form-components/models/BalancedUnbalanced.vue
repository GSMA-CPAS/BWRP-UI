<template>
  <fragment>
    <v-row v-for="(condition,index) in _data" :key="index">
      <disabled-condition :placeholder="index | startCase" />
      <disabled-threshold />
      <v-col>
        <v-text-field label="Rate" v-model="condition.rate" placeholder="0" />
      </v-col>
      <revenue-commitment-checkbox v-model="condition.revenueCommitment" />
    </v-row>
  </fragment>
</template>

<script>
import RevenueCommitmentCheckbox from "../model-components/RevenueCommitmentCheckbox";
import DisabledThreshold from "../model-components/DisabledThreshold.vue";
import DisabledCondition from "../model-components/DisabledCondition.vue";

export default {
  name: "balanced-unbalanced",
  model: "Balanced / Unbalanced",
  data() {
    return {
      balanced: { rate: null, revenueCommitment: false },
      unbalanced: { rate: null, revenueCommitment: false },
    };
  },
  components: {
    DisabledCondition,
    RevenueCommitmentCheckbox,
    DisabledThreshold,
  },
};
</script>

<style>
</style>