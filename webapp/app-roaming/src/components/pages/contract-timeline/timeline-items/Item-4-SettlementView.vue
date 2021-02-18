<template>
  <timeline-item>
    <template #content>
      <v-card class="ml-15" color="#fafafa">
        <v-card-text>
          <div>DATA UPLOADED...</div>
          <br />
          <div>
            ...by {Party} at {date}
            <v-icon color="success">mdi-check-circle-outline</v-icon>
          </div>
          <div>
            ...by {Party} at {date}
            <v-icon color="success">mdi-check-circle-outline</v-icon>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <settlement />
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <upload-settlement />
    </template>
  </timeline-item>
</template>
<script>
import Settlement from '@/components/dialogs/Settlement.vue';
import UploadSettlement from '@/components/dialogs/UploadSettlement.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'item-4',
  description: 'description',
  mixins: [timelineMixin],
  components: {
    Settlement,
    UploadSettlement,
  },
};
</script>
