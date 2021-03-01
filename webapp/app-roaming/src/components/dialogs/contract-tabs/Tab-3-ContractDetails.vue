<template>
  <div>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" class="font-weight-medium">Reference ID</v-col>
          <v-col class="subtitle-2">{{ referenceId }}</v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12" class="font-weight-medium">Transaction ID</v-col>
          <v-col class="subtitle-2">{{ blockchainTxId }}</v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12" class="font-weight-medium">Created</v-col>
          <v-col class="subtitle-2">{{ creationDate }}</v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row class="pa-2 background">
          <vue-json-pretty
            show-length
            :deep="4"
            :data="convertRawToJSON(rawData)"
          />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import {converterMixin} from '@/utils/mixins/handle-data';

export default {
  name: 'tab-3',
  label: 'Details',
  description:
    'In this tab the detals of a contract are displayed. The tab is found in the contract timeline when clicking on "View Contract"',
  components: {VueJsonPretty},
  mixins: [timelineMixin, converterMixin],
};
</script>
