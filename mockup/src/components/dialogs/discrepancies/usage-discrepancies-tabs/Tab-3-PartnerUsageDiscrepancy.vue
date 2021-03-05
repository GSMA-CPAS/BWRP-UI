<template>
  <fragment class="text-center">
    <v-container>
      <v-row>
        <v-spacer/>
        <app-button class="-1" label="export table"/>
      </v-row>
      <v-data-table :headers="headers"
                    :items="items"
                    hide-default-footer>
        <template v-slot:top>
          <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template #item="{ item }">
          <tr :class=discrepanciesFlag(item)>
            <td> {{item.hpmn}}</td>
            <td> {{item.vpmn}}</td>
            <td> {{item.month}}</td>
            <td> {{item.service}}</td>
            <td> {{item.own_usage}}</td>
            <td> {{item.partner_usage}}</td>
            <td> {{item.delta_abs}}</td>
            <td> {{item.delta_percentage}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </fragment>
</template>

<script>
import AppButton from "@/components/global-components/Button";
import {timelineMixin} from "@/utils/mixins/component-specfic";
export default {
  name: "tab-3",
  components: {AppButton},
  label: "Outbound Details",
  description: "deal details",
  mixins: [timelineMixin],
  computed: {
    headers() {
      return [
        {text: 'HPMN', value: 'hpmn', align: 'start'},
        {text: 'VPMN', value: 'vpmn', align: 'center'},
        {text: 'MONTH', value: 'month', align: 'center'},
        {text: 'SERVICE', value: 'service', align: 'center'},
        {text: 'Own usage', value: 'own_usage', align: 'center'},
        {text: 'Partner usage', value: 'partner_usage', align: 'center'},
        {text: 'Delta (abs)', value: 'delta_abs', align: 'center'},
        {text: 'Delta (%)', value: 'delta_percentage', align: 'center'},
      ];
    },
    items() {
      return [
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '092019',service:'MOC - Back Home', own_usage: '199.162', partner_usage: '200.906',delta_abs: '1.744', delta_percentage: '0.87'},
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '072019',service:'MOC - Back Home', own_usage: '184.150', partner_usage: '189.412',delta_abs: '5.262', delta_percentage: '2.85'},
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '102019',service:'MOC - Back Home', own_usage: '176.673', partner_usage: '186.830',delta_abs: '10.157', delta_percentage: '5.74'},
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '092019',service:'MOC - Local', own_usage: '6.375', partner_usage: '6.003',delta_abs: '0.372', delta_percentage: '0.58'},
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '072019',service:'MOC - Local', own_usage: '4.881', partner_usage: '4.879',delta_abs: '0.002', delta_percentage: '0.04'},
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '082019',service:'MOC - Local', own_usage: '2.644', partner_usage: '2.676',delta_abs: '0.032', delta_percentage: '1.21'},
        {hpmn: 'HTMN TADIG 1', vpmn: 'VPMN TADIG 1',month: '052019',service:'MOC - Local', own_usage: '1.505', partner_usage: '1.505',delta_abs: '0.0', delta_percentage: '0'},
      ];
    },
  },
  data(){
    return {
      search: ''
    }
  },
  methods: {

  }
}
</script>