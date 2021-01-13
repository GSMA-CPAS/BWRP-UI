<template>
  <timeline-item>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <div>STARTED on {date}</div>
          <div>EXPIRES in {time}</div>
          <div>EXPIRED at {date}</div>
        </v-card-text>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'item-3',
  description: 'description',
  mixins: [timelineMixin],
};
</script>
