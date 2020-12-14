<template>
  <fragment>

    <v-col>{{ data.usagePricing.kind }}</v-col>
    <v-col>{{ data.increment }}</v-col>
    <v-col>N/A</v-col>
    <v-col>{{ data.rate | isNil }}</v-col>
    <v-col>
      <v-icon v-if="data.revenueCommitment" color="primary">
        mdi-checkbox-marked-outline
      </v-icon>
    </v-col>
  </fragment>
</template>

<script>
import {discountModelsMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'flat-iot',
  model: 'Flat IOT',
  mixins: [discountModelsMixin],
};
</script>

<style>
</style>
