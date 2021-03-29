<template>
  <timeline-item>
    <template #content>
      <v-container/>
    </template>
    <template #icon>
      <upload-usage v-if="!isUsageSent"/>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import UploadUsage from '@/components/dialogs/UploadUsage.vue';
export default {
  name: 'item-3',
  description: 'description',
  mixins: [timelineMixin],
  components: {
    UploadUsage,
  },
};
</script>
