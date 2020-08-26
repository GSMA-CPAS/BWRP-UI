<template>
  <div>
    <div class="overflow-x-auto">
      <v-row>
        <v-col class="subtitle-2" v-for="label in columnLabels" :key="label">{{label}}</v-col>
        <v-col />
      </v-row>
      <v-row v-for="(tap,index) in taps" :key="index">
        <v-col v-for="(val,key) in tap" :key="key + index">{{val | isNil}}</v-col>
        <v-col>
          <app-button :svg="icons.edit" icon />
          <app-button
            @button-pressed="removeTAP(index)"
            :disabled="isDisabled"
            :svg="icons.remove"
            icon
          />
        </v-col>
      </v-row>
    </div>
    <app-button @button-pressed="addTAP" :svg="icons.add" icon />
  </div>
</template>
<script>
import { duplicateMixin } from "../../../../utils/mixins/component-specfic";
import { handleComponentVisibilityMixin } from "../../../../utils/mixins/handle-states";
export default {
  name: "tap-form",
  description: "description",
  mixins: [duplicateMixin, handleComponentVisibilityMixin],
  data() {
    return {
      columnLabels: [
        "COUNTRY",
        "OPERATOR",
        "SELECTED OPERATOR GROUP",
        "MCC",
        "MNC",
        "TADIG",
        "COMFONE TADIG",
        "ENTITY",
        "ENTITY TADIG",
        "TRAFFIC DIRECTION",
        "CURRENCY",
        "PRICE UNIT VOICE",
        "BILLING INCR. VOICE",
        "PRICE UNIT DATA",
        "BILLING INCR. DATA",
        "VALID FROM (DD/MM/YYYY)",
        "VALID TO (DD/MM/YYYY)",
        "VALID TO EFFECTIVE (DD/MM/YYYY)",
        "MOC VOLTE",
        "MOC LOCAL",
        "MOC BACK HOME",
        "MOC EU / EEA",
        "MOC ROW",
        "MOC PREMIUM SATELLITE",
        "MOC SPECIAL DEST.",
        "SPEC. DEST. ISO",
        "VIDEO TEL",
        "MTC",
        "SMS",
        "DATA",
        "COMMENT CM",
        "CREATED",
        "CREATED BY",
        "DECIMALS FOR PRICE PER SERVICE",
      ],
      taps: [
        {
          country: "Germany",
          operator: null,
          selectedOperatorGroup: null,
          mcc: null,
          mnc: null,
          tadig: null,
          comfoneTadig: null,
          entity: null,
          entityTadig: null,
          trafficDirection: null,
          currency: null,
          priceUnitVoice: null,
          billingIncrVoice: null,
          priceUnitData: null,
          billingIncrData: null,
          validFrom: null,
          validTo: null,
          validToEffective: null,
          mocVolte: null,
          mocLocal: null,
          mocBackHome: null,
          mocEuEea: null,
          mocRow: null,
          mocPremiumSatellite: null,
          mocSpecialDest: null,
          specDestIso: null,
          videoTel: null,
          mtc: null,
          sms: null,
          data: null,
          commentCm: null,
          created: null,
          createdBy: null,
          decimalsForPricePerService: null,
        },
      ],
    };
  },
  methods: {
    addTAP() {
      this.taps.push(this.lastTAP);
    },
    removeTAP(index) {
      this.taps.splice(index, 1);
    },
  },
  computed: {
    lastTAP() {
      return this.taps[this.taps.length - 1];
    },
    isDisabled() {
      return this.taps.length <= 1;
    },
  },
};
</script>
<style scoped>
.row {
  min-width: 500%;
}
</style>