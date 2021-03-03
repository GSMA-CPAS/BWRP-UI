<template>
  <fragment>
    <app-dialog title="Settlement Report" label="View settlement report">
      <template #content>
        <v-container>
          <v-row align="center">
            <v-col cols="3">
              <doughnut-chart-1/>
            </v-col>
            <v-col cols="3">
              <v-card style="border: green 2px solid">
                <v-card-title class="green--text headline" >Home revenues</v-card-title>
                <v-card-text class="green--text">
                  $ 458 930
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card style="border: #ff6b6b 2px solid">
                <v-card-title class="red--text headline">Partner revenues</v-card-title>
                <v-card-text class="red--text">
                  $ 322 500
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card style="border: orange 2px solid">
                <v-card-title class="orange--text headline">NET Position</v-card-title>
                <v-card-text class="orange--text">
                  $ 126 430
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="3">
              <doughnut-chart-2/>
            </v-col>
            <v-col cols="3">
              <v-card large>
                <v-card-title class="headline">Partner Charges</v-card-title>
                <v-card-text>
                  $ 455 000
                </v-card-text>
                <v-card-text class="text-right green--text text-sm-h5">
                  0.8%
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card large>
                <v-card-title class="headline">Home Charges</v-card-title>
                <v-card-text>
                  $ 321 000
                </v-card-text>
                <v-card-text class="text-right green--text text-sm-h5">
                  -0.4%
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-container>
                <v-spacer/>
                <v-btn
                    class="mx-2"
                    fab
                    dark
                    large
                    color="green"
                    @click="acceptDiscrepancies"
                >
                  <v-icon dark>
                    mdi-check
                  </v-icon>
                </v-btn>
                <v-btn
                    class="mx-2"
                    fab
                    dark
                    large
                    color="red"
                    @click="declineDiscrepancies"
                >
                  <v-icon dark>
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </app-dialog>
  </fragment>
</template>

<script>

import {timelineMixin} from "@/utils/mixins/component-specfic";
import DoughnutChart1 from "@/components/dialogs/components/charts/DoughnutChart-1";
import DoughnutChart2 from "@/components/dialogs/components/charts/DoughnutChart-2";

export default {
  name: "SettlementReport",
  components: {DoughnutChart1 ,DoughnutChart2 },
  mixins: [timelineMixin],
  data(){
  }
}

</script>

<style scoped>

</style>