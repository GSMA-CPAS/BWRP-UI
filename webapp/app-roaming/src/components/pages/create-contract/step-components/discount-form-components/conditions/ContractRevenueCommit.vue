<template>
  <fragment>
    <v-row>
      <v-col>
        Discounts will be active if the TAP charges will be at least as high as the value below.
      </v-col>
    </v-row>
    <revenue-commitment-input/>
  </fragment>
</template>

<script>

import RevenueCommitmentInput from "../condition-components/RevenueCommitmentInput";

export default {
  name: "contract-revenue-commit",
  model: "Contract Revenue Commitment",
  data() {
    return { threshold: null, rate: null, revenueCommitment: false };
  },
  components: {
    RevenueCommitmentInput,
  },
};
</script>

<style>
</style>