<template>
  <fragment>
    <app-button v-if="active"
                label="generate settlements"
                outlined
                @button-pressed="active=false;generateSettlement()"/>
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
  mixins: [timelineMixin]
};
</script>

<style scoped>

</style>
