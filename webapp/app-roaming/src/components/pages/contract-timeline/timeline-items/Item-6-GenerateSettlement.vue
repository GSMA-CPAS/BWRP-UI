<template>
  <timeline-item>
    <template #content>
      <v-container />
    </template>
    <template #icon>
      <generate-settlement />
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@mixins/component-specfic';
import GenerateSettlement from '@dialogs/GenerateSettlement';
export default {
  name: 'item-1',
  description: 'description',
  mixins: [timelineMixin],
  components: {GenerateSettlement},
};
</script>
