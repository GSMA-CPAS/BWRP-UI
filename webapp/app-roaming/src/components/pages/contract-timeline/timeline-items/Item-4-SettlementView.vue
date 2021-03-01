<template>
  <timeline-item>
    <template #content>
      <v-card class="ml-15" color="#fafafa">
        <v-card-text>
          <div class="font-weight-bold text-uppercase mb-3">Data Uploaded</div>
          <v-row class="mb-1">
            <div>Uploaded at {date} by {Party}</div>
            <v-spacer />
            <v-icon color="success">mdi-check-circle-outline</v-icon>
          </v-row>
          <v-row class="mb-1">
            <div>Uploaded at {date} by {Party}</div>
            <v-spacer />
            <v-icon color="success">mdi-check-circle-outline</v-icon>
          </v-row>
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
