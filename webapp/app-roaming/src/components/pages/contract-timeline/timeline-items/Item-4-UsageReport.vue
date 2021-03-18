<template>
  <timeline-item>
    <template #content>
      <v-card class="mr-15" color="#fafafa">
        <v-card-text>
          <div class="font-weight-bold text-uppercase mb-3">Your Usage Report</div>
          <v-row class="mb-1">
<!--            <div>Uploaded at {date} by {Party}</div>-->
<!--            <v-spacer />-->
<!--            <v-icon color="success">mdi-check-circle-outline</v-icon>-->
          </v-row>
          <v-row class="mb-1">
<!--            <div>Uploaded at {date} by {Party}</div>-->
<!--            <v-spacer />-->
<!--            <v-icon color="success">mdi-check-circle-outline</v-icon>-->
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <usage-report/>
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <send-usage v-if="!isUsageSent"/>
    </template>
  </timeline-item>
</template>
<script>
import SendUsage from '@/components/dialogs/SendUsage.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
import UsageReport from '@/components/dialogs/UsageReport';
export default {
  name: 'item-4',
  description: 'description',
  mixins: [timelineMixin],
  components: {
    UsageReport,
    SendUsage,
  },
};
</script>
