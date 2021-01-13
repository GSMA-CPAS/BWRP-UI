<template >
  <timeline-item>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>CREATED at {date} by {{ fromMSP }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <contract />
        </v-card-actions>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import Contract from '@/components/dialogs/Contract.vue';
export default {
  name: 'item-1',
  description: 'description',
  mixins: [timelineMixin],
  components: {Contract},
};
</script>
