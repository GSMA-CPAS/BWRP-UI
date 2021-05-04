<template>
  <timeline-item>
    <template #content>
    <v-container/>
    </template>
    <template #icon>
      <app-button v-if="settlementStatus === 'Accepted'" color="success" outlined disabled label="Accepted"/>
      <app-button v-if="settlementStatus === 'Rejected'" color="error" outlined disabled label="Rejected"/>
    </template>
  </timeline-item>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'Item-9-Result',
  mixins: [timelineMixin]
};
</script>

<style scoped>

</style>
