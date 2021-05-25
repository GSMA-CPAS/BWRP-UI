<template>
  <div>
    <app-dialog outlined title="Settlement Report" label="View settlement report">
      <template #content>
        <v-container style="min-width: 1100px" class="pt-0">
          <v-row align="start" class="pt-0">
            <v-col style="min-width: 250px" cols="3" class="pt-0">
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
                    <v-card-text class="black--text">
                      {{parseValue(homeRevenues)}} € <br/>
                      <span v-if="homeDeltaCommitment > 0" class="red--text text-no-wrap">{{parseValue(homeDeltaCommitment)}} € under commitment</span>
                      <span v-else class="green--text text-no-wrap">{{parseValue(homeDeltaCommitment)}} € over commitment</span>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class=" headline">Partner revenues</v-card-title>
                    <v-card-text class="black--text text-no-wrap">
                      {{ parseValue(partnerRevenues) }} € <br/>
                      <span v-if="partnerDeltaCommitment > 0" class="red--text text-no-wrap">{{parseValue(partnerDeltaCommitment)}} € under commitment</span>
                      <span v-else class="green--text text-no-wrap">{{parseValue(partnerDeltaCommitment)}} € over commitment</span>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline">NET Position</v-card-title>
                    <v-card-text class="black--text">
                      <br/>
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
                    <v-card-text class="black--text">
                      <br/>
                      {{ parseValue(partnerCharges) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card large>
                    <v-card-title class="headline">Home Charges</v-card-title>
                    <v-card-text class="black--text">
                      <br/>
                      {{ parseValue(homeCharges) }} €
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="headline">NET Position</v-card-title>
                    <v-card-text class="black--text">
                      <br/>
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
                      <br/>
                      <v-col cols="8" class="px-0 pt-0 pb-0">
                        <br/>
                        <v-card-text class="black--text">
                          {{parseValue(homeRevenues - partnerCharges)}} €
                        </v-card-text>
                      </v-col>
                      <v-col cols="4" class="px-0 pt-0 pb-0">
                        <br/>
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
                        <br/>
                        <v-card-text fluid class="black--text">
                          {{ parseValue(partnerRevenues - homeCharges) }} €
                        </v-card-text>
                      </v-col>
                      <v-col cols="4" class="px-0 pt-0 pb-0">
                        <br/>
                        <v-card-text class="text-sm-h6 px-0 pb-0 pt-3" :class="secondPercentageDiscrepancy<0?'green--text':'red--text'">
                          {{ secondPercentageDiscrepancy }} %
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card >
                    <v-card-title class="black--text headline">NET Difference</v-card-title>
                    <v-card-text class="black--text">
                      <br/>
                      {{parseValue((homeRevenues - partnerCharges)-(partnerRevenues - homeCharges))}} €
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="currentTimeline" class="pt-6 mr-3">
                <v-spacer/>
                <sign-usage-button/>
                <app-button
                      style="border: #e5e5e5 1px solid"
                      label="reject"
                      @click="rejectDiscrepancies"
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
import SignUsageButton from '@/components/pages/contract-timeline/timeline-items/buttons/SignUsage';
export default {
  name: 'SettlementReport',
  components: {DoughnutChart1, DoughnutChart2, SignUsageButton},
  mixins: [timelineMixin],
  props: {
    currentTimeline: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    homeData() {
      return this.$store.state.settlement.discrepancies.homePerspective['general_information'];
    },
    partnerData() {
      return this.$store.state.settlement.discrepancies.partnerPerspective['general_information'];
    },
    settlementReport() {
      return this.$store.state.settlement.discrepancies.settlementReport;
    },
  },
  methods: {
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
    calculate() {
      this.homeRevenues = this.settlementReport.homeRevenue.toFixed(2);
      this.partnerRevenues= this.settlementReport.partnerRevenue.toFixed(2);
      this.homeCharges= this.settlementReport.homeCharges.toFixed(2);
      this.partnerCharges= this.settlementReport.partnerCharges.toFixed(2);
      this.revenuesNetPosition = (this.homeRevenues- this.partnerRevenues).toFixed(2);
      this.chargesNetPosition = (this.homeCharges- this.partnerCharges).toFixed(2);
      this.firstPercentageDiscrepancy = parseFloat(this.homeRevenues) !== parseFloat(0.00) ? ((this.homeRevenues - this.partnerCharges)*100/this.homeRevenues).toFixed(2) : '0.00';
      this.secondPercentageDiscrepancy = parseFloat(this.homeCharges) !== parseFloat(0.00) ? ((this.partnerRevenues - this.homeCharges)*100/this.homeCharges).toFixed(2) : '0.00';
      this.firstChartData = this.calculateChartData(this.homeData, this.homeRevenues);
      this.secondChartData = this.calculateChartData(this.partnerData, this.partnerRevenues);
      this.homeDeltaCommitment = this.settlementReport.homeDeltaCommitment.toFixed(2);
      this.partnerDeltaCommitment = this.settlementReport.partnerDeltaCommitment.toFixed(2);
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
      homeDeltaCommitment: 0,
      partnerDeltaCommitment: 0,
      firstChartData: ['0', '0', '0', '0'],
      secondChartData: ['0', '0', '0', '0']
    };
  },
  created() {
    this.calculate();
  }
};
</script>

<style scoped>

</style>
