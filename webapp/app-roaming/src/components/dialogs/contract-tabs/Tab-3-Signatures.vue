<template>
  <fragment>
    <parties-header />
    <row
      v-for="(signature, msp, i) in contractSignatures"
      :label="`Signature ${i}`"
      :key="msp"
    >
      <fragment v-for="(msp, index) in parties" :key="msp">
        <v-col>{{ parseSignature(contractSignatures[msp][i]) | isNil }}</v-col>
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
      return signature && `${signature?.name}, ${signature?.role}`;
    },
  },
};
</script>