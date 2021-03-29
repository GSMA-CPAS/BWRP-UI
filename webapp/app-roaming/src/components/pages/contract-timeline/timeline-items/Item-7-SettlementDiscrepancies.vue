<template>
  <timeline-item>
    <template #content>
      <v-card color="#fafafa">
        <v-card-text>
        <div v-if="isOwnUsage">{{ selfMsp }}</div>
        <div v-else>{{ partnerMsp }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <ul/>
          <settlement-discrepancies :isHome="isHome"/>
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <v-icon color="primary" x-large>mdi-check-circle-outline</v-icon>
    </template>
  </timeline-item>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import {utilsMixin} from '@/utils/mixins/handle-data';

export default {
  name: 'Item-7-SettlementDiscrepancies',
  mixins: [timelineMixin, utilsMixin],
  props: {
    isOwnUsage: {
      type: Boolean,
      default: false
    }
  },
};
</script>

<style scoped>

</style>
