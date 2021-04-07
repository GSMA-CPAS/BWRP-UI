<template>
  <timeline-item>
    <template #content>
      <v-container />
    </template>
    <template #icon>
      <app-button
        v-if="settlementStatus === 'Accepted'"
        color="success"
        outlined
        disabled
        label="Accepted"
      />
      <app-button
        v-if="settlementStatus === 'Declined'"
        color="error"
        outlined
        disabled
        label="declined"
      />
    </template>
  </timeline-item>
</template>

<script>
import {timelineMixin} from '@mixins/component-specfic';

export default {
  name: 'Item-9-Result',
  mixins: [timelineMixin],
};
</script>

<style scoped>
</style>
