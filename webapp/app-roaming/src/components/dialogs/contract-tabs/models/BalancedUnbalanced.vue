<template>
  <fragment>
    <v-col>
      <v-row>
        <v-col>{{ data.model }}</v-col>
        <v-col>{{ data.increment }}</v-col>
        <v-col></v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col>Balanced</v-col>
        <v-col></v-col>
        <v-col>N/A</v-col>
        <v-col>{{ data.balanced.rate }}</v-col>
        <v-col>
          <v-icon v-if="data.balanced.revenueCommitment" color="primary"
            >mdi-checkbox-marked-outline</v-icon
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col>Unbalanced</v-col>
        <v-col></v-col>
        <v-col>N/A</v-col>
        <v-col>{{ data.unbalanced.rate }}</v-col>
        <v-col>
          <v-icon v-if="data.unbalanced.revenueCommitment" color="primary"
            >mdi-checkbox-marked-outline</v-icon
          >
        </v-col>
      </v-row>
      <v-divider />
    </v-col>
  </fragment>
</template>

<script>
import { discountModelsMixin } from "@/utils/mixins/component-specfic";
export default {
  name: "balanced-unbalanced",
  model: "Balanced / Unbalanced",
  mixins: [discountModelsMixin],
};
</script>

<style>
</style>