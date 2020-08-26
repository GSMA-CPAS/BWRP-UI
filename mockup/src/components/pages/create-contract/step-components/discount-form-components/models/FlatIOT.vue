<template>
  <fragment>
    <v-row>
      <disabled-condition placeholder="Unconditional" />
      <disabled-threshold />
      <v-col>
        <v-text-field v-model="rate" label="Rate" placeholder="0" />
      </v-col>
      <revenue-commitment-checkbox v-model="revenueCommitment" />
    </v-row>
  </fragment>
</template>

<script>
import DisabledThreshold from "../model-components/DisabledThreshold.vue";
import DisabledCondition from "../model-components/DisabledCondition.vue";
import RevenueCommitmentCheckbox from "../model-components/RevenueCommitmentCheckbox.vue";
export default {
  name: "flat-iot",
  model: "Flat IOT",
  data() {
    return { rate: null, revenueCommitment: false };
  },
  components: {
    RevenueCommitmentCheckbox,
    DisabledCondition,
    DisabledThreshold,
  },
};
</script>

<style>
</style>