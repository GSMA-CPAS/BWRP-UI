<template>
  <fragment>
    <v-col>{{data.model}}</v-col>
    <v-col>{{data.increment}}</v-col>
    <v-col>N/A</v-col>
    <v-col>N/A</v-col>
    <v-col>
      <v-icon v-if="data.revenueCommitment" color="primary">mdi-checkbox-marked-outline</v-icon>
    </v-col>
  </fragment>
</template>

<script>
import { discountModelsMixin } from "../../../../utils/mixins/component-specfic";
export default {
  name: "unlimited-commit",
  model: "Unlimited Commit",
  mixins: [discountModelsMixin],
};
</script>

<style>
</style>