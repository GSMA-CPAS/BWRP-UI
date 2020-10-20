<template>
  <fragment>
    <parties />
    <row v-for="{ key, label } in fields" :label="label" :key="key">
      <fragment v-for="(mspid, index) in partyMspids" :key="mspid">
        <v-col>{{ bankDetails[mspid][key] }}</v-col>
        <v-divider v-if="index === 0" vertical></v-divider>
      </fragment>
    </row>
  </fragment>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import Parties from "./Parties.vue";
import { bankFieldsMixin } from "../../../utils/mixins/component-specfic";
export default {
  name: "tab-2",
  label: "Bank details",
  description: "description",
  mixins: [bankFieldsMixin],
  components: {
    Parties,
  },
  computed: {
    ...mapState("document", ["bankDetails"]),
    ...mapGetters("document", ["partyMspids"]),
  },
};
</script>