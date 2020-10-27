<template>
  <fragment>
    <v-row align="baseline" class="font-weight-medium">
      <v-col cols="2" />
      <v-divider vertical></v-divider>
      <v-col>
        <v-row class="primary--text text-uppercase">
          <v-col>{{ parties[currentParty] }}</v-col>
          <v-col class="text-center" cols="2">
            <app-button
              label="Switch Party"
              outlined
              @button-pressed="switchPartner"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="{ label, key } in subRowLabels" :key="key">{{
            label
          }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
  </fragment>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "parties-header",
  description: "description",
  computed: { ...mapGetters("document", ["parties"]) },
  mixins: [],
  data() {
    return { currentParty: 0 };
  },
  components: {},
  // TODO: combine both versions of headers
  props: { single: Boolean, subRowLabels: Array },
  watch: {},
  methods: {
    switchPartner() {
      this.currentParty = this.currentParty === 0 ? 1 : 0;
      this.$emit("party-switch", this.currentParty);
    },
  },
  mounted() {},
};
</script>