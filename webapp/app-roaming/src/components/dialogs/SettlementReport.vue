<template>
  <div>
    <app-dialog
      outlined
      title="Settlement Report"
      label="View settlement report"
    >
      <template #content>
        <v-container>
          <v-row align="center">
            <v-col cols="3">
              <doughnut-chart-1 :chartData="firstChartData" />
            </v-col>
            <v-col cols="3">
              <v-card style="border: green 2px solid">
                <v-card-title class="green--text headline"
                  >Home revenues</v-card-title
                >
                <v-card-text class="green--text">
                  {{ homeRevenues }} €
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card style="border: #ff6b6b 2px solid">
                <v-card-title class="red--text headline"
                  >Partner revenues</v-card-title
                >
                <v-card-text class="red--text">
                  {{ partnerRevenues }} €
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card style="border: orange 2px solid">
                <v-card-title class="orange--text headline"
                  >NET Position</v-card-title
                >
                <v-card-text class="orange--text">
                  {{ netPosition }} €
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="3">
              <doughnut-chart-2 :chartData="secondChartData" />
            </v-col>
            <v-col cols="3">
              <v-card large>
                <v-card-title class="headline">Partner Charges</v-card-title>
                <v-card-text> {{ partnerCharges }} € </v-card-text>
                <v-card-text
                  class="text-right text-sm-h5"
                  :class="
                    firstPercentageDiscrepancy < 0 ? 'red--text' : 'green--text'
                  "
                >
                  {{ firstPercentageDiscrepancy }} %
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card large>
                <v-card-title class="headline">Home Charges</v-card-title>
                <v-card-text> {{ homeCharges }} € </v-card-text>
                <v-card-text
                  class="text-right text-sm-h5"
                  :class="
                    secondPercentageDiscrepancy < 0
                      ? 'green--text'
                      : 'red--text'
                  "
                >
                  {{ secondPercentageDiscrepancy }} %
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-container>
                <v-spacer />
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  large
                  color="green"
                  @click="acceptDiscrepancies"
                >
                  <v-icon dark> mdi-check </v-icon>
                </v-btn>
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  large
                  color="red"
                  @click="declineDiscrepancies"
                >
                  <v-icon dark> mdi-close </v-icon>
                </v-btn>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </app-dialog>
  </div>
</template>

<script>
import {timelineMixin} from '@mixins/component-specfic';
import DoughnutChart1 from '@dialogs/components/charts/DoughnutChart-1';
import DoughnutChart2 from '@dialogs/components/charts/DoughnutChart-2';
export default {
  name: 'SettlementReport',
  components: {DoughnutChart1, DoughnutChart2},
  mixins: [timelineMixin],
  computed: {
    homeData() {
      return this.$store.state.settlement.discrepancies.homePerspective[
        'general_information'
      ];
    },
    partnerData() {
      return this.$store.state.settlement.discrepancies.partnerPerspective[
        'general_information'
      ];
    },
  },
  methods: {
    calculateHomeSettlement(field) {
      let result = 0;
      this.homeData?.forEach((record) => {
        result += record[field];
      });
      return result;
    },
    calculatePartnerSettlement(field) {
      let result = 0;
      this.partnerData?.forEach((record) => {
        result += record[field];
      });
      return result;
    },
    calculateChartData(settlementData, divider) {
      let voice;
      let sms;
      let data = 0;
      settlementData?.forEach((record) => {
        if (record.service === 'Voice') {
          voice = ((record.own_calculation * 100) / divider).toFixed(0);
        } else if (record.service === 'SMS') {
          sms = ((record.own_calculation * 100) / divider).toFixed(0);
        } else if (record.service === 'Data') {
          data = ((record.own_calculation * 100) / divider).toFixed(0);
        }
      });
      return [data, voice, sms];
    },
    calculateHomeRevenues() {
      this.homeRevenues = this.calculateHomeSettlement(
        'own_calculation',
      ).toFixed(2);
      this.partnerRevenues = this.calculatePartnerSettlement(
        'own_calculation',
      ).toFixed(2);
      this.homeCharges = this.calculatePartnerSettlement(
        'partner_calculation',
      ).toFixed(2);
      this.partnerCharges = this.calculateHomeSettlement(
        'partner_calculation',
      ).toFixed(2);
      this.netPosition = (this.homeRevenues - this.partnerRevenues).toFixed(2);
      this.firstPercentageDiscrepancy = (
        ((this.homeRevenues - this.partnerCharges) * 100) /
        this.homeRevenues
      ).toFixed(2);
      this.secondPercentageDiscrepancy = (
        ((this.partnerRevenues - this.homeCharges) * 100) /
        this.partnerRevenues
      ).toFixed(2);
      this.firstChartData = this.calculateChartData(
        this.homeData,
        this.homeRevenues,
      );
      this.secondChartData = this.calculateChartData(
        this.partnerData,
        this.partnerRevenues,
      );
    },
  },
  data() {
    return {
      homeRevenues: 0,
      partnerRevenues: 0,
      homeCharges: 0,
      partnerCharges: 0,
      netPosition: 0,
      firstPercentageDiscrepancy: 0,
      secondPercentageDiscrepancy: 0,
      firstChartData: ['0', '0', '0'],
      secondChartData: ['0', '0', '0'],
    };
  },
  created() {
    this.calculateHomeRevenues();
  },
};
</script>

<style scoped>
</style>
