<template>
  <v-col>
    <v-row>
      <v-col>{{data.model}}</v-col>
      <v-col>{{data.increment}}</v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
    <v-divider />
    <v-row v-for="({to,from,rate,revenueCommitment},index ) in data.baselines" :key="index">
      <v-col>{{`Baseline ${index + 1}`}}</v-col>
      <v-col></v-col>
      <v-col>{{`${from} ➜ ${to}`}}</v-col>
      <v-col>{{rate}}</v-col>
      <v-col>
        <v-icon v-if="revenueCommitment" color="primary">mdi-checkbox-marked-outline</v-icon>
      </v-col>
    </v-row>
    <v-divider />
  </v-col>
</template>

<script>
import { discountModelsMixin } from "../../../../utils/mixins/component-specfic";
export default {
  name: "baseline-template",
  model: "Baseline",
  mixins: [discountModelsMixin],
};
</script>