<template>
  <fragment>
    <parties-header />
    <row v-for="{ key, label } in fields" :label="label" :key="key">
      <fragment v-for="(msp, index) in parties" :key="msp">
        <v-col>{{ bankDetails[msp][key] | isNil }}</v-col>
        <v-divider v-if="index === 0" vertical></v-divider>
      </fragment>
    </row>
  </fragment>
</template>
<script>
import PartiesHeader from "../components/PartiesHeader.vue";
import {
  bankFieldsMixin,
  timelineMixin,
} from "@/utils/mixins/component-specfic";
export default {
  name: "tab-2",
  label: "Bank details",
  description:
    "In this tab the bank details of a contract are displayed. The tab is found in the contract timeline when clicking on 'View Contract'",
  mixins: [bankFieldsMixin, timelineMixin],
  components: {
    PartiesHeader,
  },
};
</script>