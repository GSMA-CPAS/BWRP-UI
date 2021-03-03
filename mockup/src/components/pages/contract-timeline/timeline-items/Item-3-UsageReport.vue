<template>
  <timeline-item>
    <template #content>
      <v-card v-if="contractState >= CONTRACT_STATE.USAGE_REPORT_UPLOADED" color="#fafafa">
        <v-card-text>
          <div v-if="isHome">DTAG</div>
          <div v-else>TMUS</div>
          <div>UPLOADED on {date}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <usage-report v-if="isHome" :data="data.DTAG" />
          <usage-report v-else :data="data.TMUS" />
          <app-button title="Export" label="export" @button-pressed="showUsage()"></app-button>
        </v-card-actions>
      </v-card>

    </template>
    <template #icon>
      <upload-usage-report v-if="contractState === CONTRACT_STATE.USAGE_REPORT_NOT_UPLOADED"/>
      <send-usage-report v-else-if="contractState === CONTRACT_STATE.USAGE_REPORT_UPLOADED"/>
      <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from "@/utils/mixins/component-specfic";
import TimelineItem from "@/components/global-components/TimelineItem";
import UploadUsageReport from "@/components/dialogs/UploadUsageReport";
import {CONTRACT_STATE} from "@/utils/Enums";
import SendUsageReport from "@/components/pages/contract-timeline/timeline-items/buttons/SendUsageReport";
import UsageReport from "@/components/dialogs/UsageReport";
import AppButton from "@/components/global-components/Button";

export default {
  name: "item-1",
  description: "description",
  mixins: [timelineMixin],
  data() {
    return {
      CONTRACT_STATE: CONTRACT_STATE,
      data: {
        DTAG: {
          headers: [
            {text: 'Year/Month', value:'yearmonth'},
            {text: 'HPMN', value:'hpmn'},
            {text: 'VPMN', value:'vpmn'},
            {text: 'Service categorised', value:'serviceCategorised'},
            {text: 'Value', value:'value'},
            {text: 'Units', value:'units'},
            {text: 'Charges', value:'charges'},
            {text: 'Taxes', value:'taxes'},
          ],
          outbound: {
            items: [
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 85,
                units: 'min',
                charges: 56.80,
                taxes: 12.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 185,
                units: 'min',
                charges: 77.80,
                taxes: 12.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 15,
                units: 'min',
                charges: 1.80,
                taxes: 1.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 1075,
                units: 'min',
                charges: 12.80,
                taxes: 1.04,
              },
            ]
          },
          inbound: {
            items: [
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 187,
                units: 'min',
                charges: 167.80,
                taxes: 2.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 185,
                units: 'min',
                charges: 16.80,
                taxes: 2.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 18,
                units: 'min',
                charges: 16.80,
                taxes: 22.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 7,
                units: 'min',
                charges: 1.80,
                taxes: 2.04,
              },
            ]
          },
        },
        TMUS: {
          headers: [
            {text: 'Year/Month', value:'yearmonth'},
            {text: 'HPMN', value:'hpmn'},
            {text: 'VPMN', value:'vpmn'},
            {text: 'Service categorised', value:'serviceCategorised'},
            {text: 'Value', value:'value'},
            {text: 'Units', value:'units'},
            {text: 'Charges', value:'charges'},
            {text: 'Taxes', value:'taxes'},
          ],
          inbound: {
            items: [
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 85,
                units: 'min',
                charges: 56.80,
                taxes: 12.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 185,
                units: 'min',
                charges: 77.80,
                taxes: 12.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 15,
                units: 'min',
                charges: 1.80,
                taxes: 1.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'DEUV2',
                vpmn: 'ESPV1',
                serviceCategorised: 'MOC OTHER',
                value: 1075,
                units: 'min',
                charges: 12.80,
                taxes: 1.04,
              },
            ]
          },
          outbound: {
            items: [
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 187,
                units: 'min',
                charges: 167.80,
                taxes: 2.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 185,
                units: 'min',
                charges: 16.80,
                taxes: 2.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 18,
                units: 'min',
                charges: 16.80,
                taxes: 22.04,
              },
              {
                yearmonth: 201901,
                hpmn: 'ESPV1',
                vpmn: 'DEUV2',
                serviceCategorised: 'MOC Local',
                value: 7,
                units: 'min',
                charges: 1.80,
                taxes: 2.04,
              },
            ]
          },
        },
      },

    };
  },
  components: {AppButton, UploadUsageReport, TimelineItem, SendUsageReport, UsageReport },
  props: { isHome: Boolean },
  methods: {
    showUsage() {
      console.log(this.isHome);
    }
  },
  watch: {},
  computed: {},
  mounted() {},
};
</script>