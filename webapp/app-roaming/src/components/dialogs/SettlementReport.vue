<template>
  <div>
    <app-dialog outlined title="Settlement Report" label="View settlement report">
      <template #content>
        <v-container class="pt-0">
          <v-row align="start" class="pt-0">
            <v-col style="min-width: 220px" cols="3" class="pt-0">
              <v-row>
                <v-col cols="12">
                  <v-row class="pl-7 pb-1">
                    <span class="black--text font-weight-bold">Home revenues</span>
                  </v-row>
                  <doughnut-chart-1 :chartData="firstChartData"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-row class="pl-7 pb-1">
                    <span class="black--text font-weight-bold">Partner revenues</span>
                  </v-row>
                  <doughnut-chart-2 :chartData="secondChartData"/>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="9">
              <v-row>
                <span class="black--text font-weight-bold">My view</span>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline" >Home revenues</v-card-title>
                    <v-card-text>
                      {{parseValue(homeRevenues)}} €
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class=" headline">Partner revenues</v-card-title>
                    <v-card-text>
                      {{ parseValue(partnerRevenues) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline">NET Position</v-card-title>
                    <v-card-text>
                      {{ parseValue(revenuesNetPosition) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <span class="black--text font-weight-bold">Partner view</span>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-card large>
                    <v-card-title class="headline">Partner Charges</v-card-title>
                    <v-card-text>
                      {{ parseValue(partnerCharges) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card large>
                    <v-card-title class="headline">Home Charges</v-card-title>
                    <v-card-text>
                      {{ parseValue(homeCharges) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline">NET Position</v-card-title>
                    <v-card-text>
                      {{ parseValue(chargesNetPosition) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <span class="black--text font-weight-bold">Differences</span>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline pb-0">Difference</v-card-title>
                    <v-row>
                      <v-col cols="8" class="px-0 pt-0 pb-0">
                        <v-card-text>
                          {{parseValue(homeRevenues - partnerCharges)}} €
                        </v-card-text>
                      </v-col>
                      <v-col cols="4" class="px-0 pt-0 pb-0">
                        <v-card-text class="text-sm-h6 px-0 pb-0 pt-3" :class="firstPercentageDiscrepancy<0?'red--text':'green--text'">
                          {{ firstPercentageDiscrepancy }} %
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card>
                    <v-card-title class="headline pb-0">Difference</v-card-title>
                    <v-row>
                      <v-col cols="8" class="px-0 pt-0 pb-0">
                        <v-card-text fluid>
                          {{ parseValue(partnerRevenues - homeCharges) }} €
                        </v-card-text>
                      </v-col>
                      <v-col cols="4" class="px-0 pt-0 pb-0">
                        <v-card-text class="text-sm-h6 px-0 pb-0 pt-3" :class="secondPercentageDiscrepancy<0?'green--text':'red--text'">
                          {{ secondPercentageDiscrepancy }} %
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline">NET Difference</v-card-title>
                    <v-card-text>
                      {{parseValue((homeRevenues - partnerCharges)-(partnerRevenues - homeCharges))}} €
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="mt-6 mr-3">
                  <v-spacer/>
                  <app-button
                      class="mr-3"
                      style="border: #e5e5e5 1px solid"
                      label="accept"
                      @click="acceptDiscrepancies"
                  >
                  </app-button>
                  <app-button
                      style="border: #e5e5e5 1px solid"
                      label="reject"
                      @click="declineDiscrepancies"
                  >
                  </app-button>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </app-dialog>
  </div>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import DoughnutChart1 from '@/components/dialogs/components/charts/DoughnutChart-1';
import DoughnutChart2 from '@/components/dialogs/components/charts/DoughnutChart-2';
export default {
  name: 'SettlementReport',
  components: {DoughnutChart1, DoughnutChart2},
  mixins: [timelineMixin],
  computed: {
    homeData() {
      return this.$store.state.settlement.discrepancies.homePerspective['general_information'];
    },
    partnerData() {
      return this.$store.state.settlement.discrepancies.partnerPerspective['general_information'];
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
      let moc; let mtc; let sms; let data = 0;
      if (parseFloat(divider) === parseFloat(0.00)) return [0, 0, 0, 0];
      settlementData?.forEach((record) => {
        if (record.service === 'MOC') {
          moc = ((record.own_calculation * 100)/divider).toFixed(0);
        } else if (record.service === 'MTC') {
          mtc = ((record.own_calculation * 100)/divider).toFixed(0);
        } else if (record.service === 'SMS') {
          sms = ((record.own_calculation * 100)/divider).toFixed(0);
        } else if (record.service === 'Data') {
          data = ((record.own_calculation * 100)/divider).toFixed(0);
        }
      });
      return [data, mtc, moc, sms];
    },
    calculateHomeRevenues() {
      this.homeRevenues = this.calculateHomeSettlement('own_calculation').toFixed(2);
      this.partnerRevenues= this.calculatePartnerSettlement('own_calculation').toFixed(2);
      this.homeCharges= this.calculatePartnerSettlement('partner_calculation').toFixed(2);
      this.partnerCharges= this.calculateHomeSettlement('partner_calculation').toFixed(2);
      this.revenuesNetPosition = (this.homeRevenues- this.partnerRevenues).toFixed(2);
      this.chargesNetPosition = (this.homeCharges- this.partnerCharges).toFixed(2);
      this.firstPercentageDiscrepancy = parseFloat(this.homeRevenues) !== parseFloat(0.00) ? ((this.homeRevenues - this.partnerCharges)*100/this.homeRevenues).toFixed(2) : '0.00';
      this.secondPercentageDiscrepancy = parseFloat(this.homeCharges) !== parseFloat(0.00) ? ((this.partnerRevenues - this.homeCharges)*100/this.homeCharges).toFixed(2) : '0.00';
      this.firstChartData = this.calculateChartData(this.homeData, this.homeRevenues);
      this.secondChartData = this.calculateChartData(this.partnerData, this.partnerRevenues);
    }
  },
  data() {
    return {
      homeRevenues: 0,
      partnerRevenues: 0,
      homeCharges: 0,
      partnerCharges: 0,
      revenuesNetPosition: 0,
      chargesNetPosition: 0,
      firstPercentageDiscrepancy: 0,
      secondPercentageDiscrepancy: 0,
      firstChartData: ['0', '0', '0', '0'],
      secondChartData: ['0', '0', '0', '0']
    };
  },
  created() {
    this.calculateHomeRevenues();
  }
};
</script>

<style scoped>

</style>
