<template >
  <timeline-item>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <div><b>CONTRACT</b> {{ contractId }}</div>
          <div><b>CREATED</b> {{ creationDate }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <app-button @click="exportRawData()" :ripple="false" label="Export" />
          <div class="mr-2" />
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
  methods: {
    exportRawData() {
      const data =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.rawData));
      const link = document.createElement('a');
      link.href = data;
      link.setAttribute('download', this.referenceId);
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>
