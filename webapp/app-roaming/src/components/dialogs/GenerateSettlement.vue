<template>
  <div>
    <app-button
      v-if="!areSettlementsGenerated"
      label="generate settlements"
      outlined
      @button-pressed="generateSettlements()"
    />
    <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
  </div>
</template>

<script>
import {timelineMixin} from '@mixins/component-specfic';

export default {
  name: 'GenerateSettlement',
  data() {
    return {
      active: true,
    };
  },
  mixins: [timelineMixin],
  methods: {
    show() {
      console.log(this.$store.state.settlement);
    },
  },
};
</script>

<style scoped>
</style>
