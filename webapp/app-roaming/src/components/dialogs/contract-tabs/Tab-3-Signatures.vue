<template>
  <fragment>
    <parties-header />
    <row
      v-for="i in longestArray([
        documentData[fromMSP].signatures,
        documentData[toMSP].signatures,
      ])"
      :label="`Signature ${i}`"
      :key="i"
    >
      <fragment v-for="(msp, index) in parties" :key="msp">
        <v-col>{{
          parseSignature(documentData[msp].signatures[i - 1]) | isNil
        }}</v-col>
        <v-divider v-if="index === 0" vertical></v-divider>
      </fragment>
    </row>
  </fragment>
</template>
<script>
import { timelineMixin } from "@/utils/mixins/component-specfic";
import PartiesHeader from "../components/PartiesHeader.vue";
export default {
  name: "tab-3",
  label: "Signatures",
  description:
    "In this tab the signatures of a contract are displayed. The tab is found in the contract timeline when clicking on 'View Contract'",
  mixins: [timelineMixin],
  data() {
    return {};
  },
  components: {
    PartiesHeader,
  },
  methods: {
    parseSignature(signature) {
      return `${this.$options.filters.isNil(
        signature?.name
      )}, ${this.$options.filters.isNil(signature?.role)}`;
    },
  },
};
</script>