<template>
  <fragment>
    <v-stepper vertical v-model="step">
      <fragment v-for="({content,index}) in steps" :key="index">
        <v-stepper-step :complete="step  > index" :step="index">{{content.description}}</v-stepper-step>
        <v-stepper-items>
          <v-stepper-content :step="index">
            <component :is="content" />
          </v-stepper-content>
        </v-stepper-items>
      </fragment>
      <v-row class="mt-5">
        <app-button class="ml-5" label="Export Draft" @button-pressed="downloadContract" />
        <v-spacer />
        <app-button
          :disabled="step <= steps.length"
          @click="saveContract"
          class="mr-5"
          label="Confirm"
        />
      </v-row>
    </v-stepper>
  </fragment>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { PATHS } from "../../../utils/Enums";
export default {
  name: "stepper",
  description: "Stepper used for contract-creation.",
  methods: {
    ...mapActions("contract/new", ["addContract", "resetState"]),
    saveContract() {
      this.addContract();
      this.$router.push(this.path);
    },
    downloadContract() {
      const data =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.contract));
      const link = document.createElement("a");
      link.href = data;
      link.setAttribute("download", "contract.json");
      document.body.appendChild(link);
      link.click();
    },
  },
  computed: {
    ...mapGetters("contract/new", ["contract"]),
    ...mapState("contract/new", ["step"]),
    path() {
      return PATHS.contracts;
    },
    steps() {
      const components = require.context(
        "./steps/",
        false,
        /(Step-).*.(vue|js)$/
      );
      var i = 1;
      const steps = components
        .keys()
        .map((x) => ({ content: components(x).default, index: i++ }));
      return steps;
    },
  },
  beforeDestroy() {
    this.resetState();
  },
};
</script>