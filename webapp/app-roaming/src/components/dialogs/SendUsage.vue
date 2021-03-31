<template>
  <div>
    <app-button v-if="active"
                label="send"
                outlined
                @button-pressed="active=false;sendUsage()"/>
    <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
  </div>
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
