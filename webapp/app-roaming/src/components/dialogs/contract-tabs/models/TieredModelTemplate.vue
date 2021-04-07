<template>
  <v-col class="striped-column-container">
    <v-row>
      <v-col class="striped-column"
        ><b>{{ modelType }}</b></v-col
      >
      <v-col class="striped-column">{{ data.unit }}</v-col>
      <v-col class="striped-column">{{ data.ratingPlan.kind }}</v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column"
        ><v-icon v-if="inCommitment" color="primary">
          mdi-checkbox-marked-outline
        </v-icon></v-col
      >
    </v-row>
    <v-divider />
    <v-row
      v-for="({start, fixedPrice, linearPrice}, index) in data.ratingPlan.rate
        .thresholds"
      :key="index"
    >
      <v-col class="striped-column">Normal</v-col>
      <v-col class="striped-column">{{ `Tier ${index + 1}` }}</v-col>
      <v-col class="striped-column">{{
        `${start} ➜ ${
          index + 1 === data.ratingPlan.rate.thresholds.length
            ? 'Unlimited'
            : data.ratingPlan.rate.thresholds[index + 1].start
        }`
      }}</v-col>
      <v-col class="striped-column">{{
        Number(fixedPrice || 0).toLocaleString()
      }}</v-col>
      <v-col class="striped-column">{{
        Number(linearPrice || 0).toLocaleString()
      }}</v-col>
      <v-col class="striped-column"></v-col>
      <!--<v-col>
        <v-icon v-if="revenueCommitment" color="primary"
          >mdi-checkbox-marked-outline</v-icon
        >
      </v-col>-->
    </v-row>
  </v-col>
</template>

<script>
import {discountModelsMixin} from '@mixins/component-specfic';
export default {
  name: 'tiered-model-template',
  label: 'Tiered Model Template',
  mixins: [discountModelsMixin],
  props: ['modelType', 'inCommitment'],
};
</script>
