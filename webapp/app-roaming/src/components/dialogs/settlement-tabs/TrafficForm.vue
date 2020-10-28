<template>
  <div>
    <parties-header @party-switch="setParty" :sub-row-labels="labels" />
    <v-row
      align="baseline"
      v-for="(data, service) in settlementDetails[currentParty]"
      :key="service"
    >
      <v-col class="font-weight-medium" cols="2">{{ service }}</v-col>
      <v-divider vertical />
      <v-col>
        <v-row>
          <v-col v-for="{ key } in labels" :key="key">{{ data[key] }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col class="primary--text" cols="2">Totals</v-col>
      <v-divider vertical />
      <v-col v-for="{ key } in labels" :key="key">{{ totals[key] }}</v-col>
    </v-row>
  </div>
</template>
<script>
import { utilsMixin } from "@/utils/mixins/handle-data";
import PartiesHeader from "../components/PartiesHeader.vue";
export default {
  name: "traffic-form",
  description:
    "This is the traffic form, which displays either the out- or inbound details.",
  mixins: [utilsMixin],
  data() {
    return {
      currentParty: 0,
      settlementDetails: [
        // TMUS
        {
          MOC: {
            traffic: 21321,
            avgTapRate: 0,
            tapCharges: 0,
            preCommIot: 0,
            postCommIot: 0,
            discountedCharges: 0,
            discount: 1,
          },
          "MOC Local": {
            traffic: 3210,
            avgTapRate: 0,
            tapCharges: 0,
            preCommIot: 0,
            postCommIot: 0,
            discountedCharges: 0,
            discount: 1,
          },
        },
        // DTAG
        {
          MOC: {
            traffic: 21321,
            avgTapRate: 0,
            tapCharges: 0,
            preCommIot: 0,
            postCommIot: 0,
            discountedCharges: 0,
            discount: 1,
          },
          "MOC Local": {
            traffic: 130,
            avgTapRate: 0,
            tapCharges: 0,
            preCommIot: 0,
            postCommIot: 0,
            discountedCharges: 0,
            discount: 1,
          },
        },
      ],
    };
  },
  components: {
    PartiesHeader,
  },
  methods: {
    setParty(party) {
      this.currentParty = party;
    },
  },
  computed: {
    totals() {
      return Object.values(this.settlementDetails[this.currentParty]).reduce(
        (totals, curService) => {
          for (const key in totals) {
            totals[key] += curService[key];
          }
          return totals;
        },
        {
          traffic: 0,
          avgTapRate: 0,
          tapCharges: 0,
          preCommIot: 0,
          postCommIot: 0,
          discountedCharges: 0,
          discount: 0,
        }
      );
    },
    labels() {
      const trafficLabels = [
        "Traffic",
        "Avg. Tap Rate",
        "Tap Charges",
        "Pre Comm. IOT",
        "Post Comm. IOT",
        "Discounted Charges",
        "Discount",
      ];
      return this.labelsToCamelCase(trafficLabels);
    },
  },
};
</script>
<style scoped>
.no-wrap {
  flex-wrap: nowrap;
}
</style>