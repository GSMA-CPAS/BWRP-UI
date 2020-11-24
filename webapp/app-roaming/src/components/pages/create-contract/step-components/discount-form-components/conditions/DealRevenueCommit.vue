<template>
  <fragment>
    <v-row>
      <v-col>
        Discounts will be active if the calculated deal charges will be at least as high as the value below.
      </v-col>
    </v-row>
    <revenue-commitment-input v-model="revenueCommitment"/>
  </fragment>
</template>

<script>

import RevenueCommitmentInput from "../condition-components/RevenueCommitmentInput";

export default {
  name: "deal-revenue-commit",
  model: "Deal Revenue Commitment",
  data() {
    return { revenueCommitment: null };
  },
  watch: {
    revenueCommitment: {
      handler(val) {
        this.$emit("input", val);
      },
      deep: true,
    },
  },
  components: {
    RevenueCommitmentInput,
  },
};
</script>

<style>
</style>