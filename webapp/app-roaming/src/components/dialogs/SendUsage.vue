<template>
  <fragment>
    <app-button v-if="active"
                label="send"
                outlined
                @button-pressed="active=false;sendUsage()"/>
    <v-icon v-else color="success" x-large>mdi-check-circle-outline</v-icon>
  </fragment>
</template>

<script>

import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'SendUsage',
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
