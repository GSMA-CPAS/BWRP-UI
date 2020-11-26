<template>
  <div>
    <parties-header />
    <v-row align="baseline" class="font-weight-medium">
      <v-col cols="3" class="primary--text text-uppercase">Breakdown</v-col>
      <v-divider vertical></v-divider>
      <v-row class="pa-2">
        <v-col>Outbound</v-col>
        <v-col>Inbound</v-col>
      </v-row>
      <v-divider vertical></v-divider>
      <v-row class="pa-2">
        <v-col>Outbound</v-col>
        <v-col>Inbound</v-col>
      </v-row>
    </v-row>
    <row label="TAP charges (€)">
      <v-row class="pa-2">
        <v-col>20 312 312, 22</v-col>
        <v-col>21 312 312, 22</v-col>
      </v-row>
      <v-divider vertical></v-divider>
      <v-row class="pa-2">
        <v-col>20 312 312, 22</v-col>
        <v-col>21 312 312, 22</v-col>
      </v-row>
    </row>
    <row label="Discount (€)">
      <v-row class="pa-2">
        <v-col>1 112 112, 22</v-col>
        <v-col>1 612 112, 22</v-col>
      </v-row>
      <v-divider vertical></v-divider>
      <v-row class="pa-2">
        <v-col>1 112 112, 22</v-col>
        <v-col>1 612 112, 22</v-col>
      </v-row>
    </row>
    <v-row
      align="baseline"
      class="primary--text text-uppercase font-weight-medium"
    >
      <v-col cols="3">Payable (€)</v-col>
      <v-divider vertical></v-divider>
      <v-row justify="center">-500 000</v-row>
      <v-divider vertical></v-divider>
      <v-row justify="center">-500 000</v-row>
    </v-row>
    <row label="Discount Settlement">
      <v-col>
        <v-row class="font-weight-medium pa-2">Net Positions</v-row>
        <v-row>
          <v-col>Difference</v-col>
          <v-col>0, 00</v-col>
        </v-row>
        <v-row>
          <v-col>Post 50/50 Split</v-col>
          <v-col>0, 00</v-col>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-row class="font-weight-medium pa-2">50/50 Split Approval</v-row>
        <v-row>
          <v-col>{{ parties[0] }}</v-col>
          <v-col class="font-weight-medium text-uppercase">Awaiting</v-col>
        </v-row>
        <v-row>
          <v-col>{{ parties[1] }}</v-col>
          <v-col class="font-weight-medium text-uppercase">Awaiting</v-col>
        </v-row>
      </v-col>
    </row>
  </div>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import PartiesHeader from '../components/PartiesHeader.vue';
export default {
  name: 'tab-1',
  label: 'General Information',
  description:
    'In this tab the general information of a settlement is displayed. The tab is found in the contract timeline when clicking on \'View Settlement\'',
  mixins: [timelineMixin],
  components: {
    PartiesHeader,
  },
};
</script>
