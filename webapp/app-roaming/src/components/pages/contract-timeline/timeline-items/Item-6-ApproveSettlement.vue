<template>
  <timeline-item>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <div>Approved...</div>
          <br />
          <div>
            ...awaiting from {Party}
            <v-icon color="error">mdi-close-circle-outline</v-icon>
          </div>
          <div>
            ...awaiting from {Party}
            <v-icon color="error">mdi-close-circle-outline</v-icon>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template #icon>
      <approve-button />
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import ApproveButton from './buttons/Approve.vue';
export default {
  name: 'item-1',
  description: 'description',
  mixins: [timelineMixin],
  components: {ApproveButton},
};
</script>
