<template>
  <timeline-item>
    <template #content>
      <v-card class="mr-15" color="#fafafa">
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
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <send-usage />
    </template>
  </timeline-item>
</template>
<script>
import SendUsage from '@/components/dialogs/SendUsage.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'item-4',
  description: 'description',
  mixins: [timelineMixin],
  components: {
    SendUsage,
  },
};
</script>
