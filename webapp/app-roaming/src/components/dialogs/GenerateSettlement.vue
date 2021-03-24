<template>
  <fragment>
    <app-button v-if="active"
                label="generate settlements"
                outlined
                @button-pressed="generateSettlement()"/>
    <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
  </fragment>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'GenerateSettlement',
  data() {
    return {
      active: true
    };
  },
  mixins: [timelineMixin],
  methods: {
    generateSettlement() {
      console.log(this.$store.state.usage.discrepancies);
      console.log(this.$store.state.usage.ownUsage.id);
      console.log(this.$store.state.usage.partnerUsage.id);
    }
  }
};
</script>

<style scoped>

</style>
