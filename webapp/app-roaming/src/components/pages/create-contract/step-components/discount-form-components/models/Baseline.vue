<template>
  <fragment>
    <v-row
      align="baseline"
      v-for="(baseline, index) in baselines"
      v-bind:key="baseline.key"
    >
      <disabled-condition :placeholder="'Baseline ' + (index + 1)" />
      <v-col>
        <v-text-field
          :disabled="index === 0"
          label="From"
          v-model="baseline.from"
          @input="updateThreshold(index)"
          placeholder="from"
        />
      </v-col>
      <v-col>
        <v-text-field
          :disabled="index === lastIndex"
          label="To"
          v-model="baseline.to"
          @input="updateThreshold(index)"
          placeholder="to"
        />
      </v-col>
      <v-col>
        <v-text-field label="Rate" v-model="baseline.rate" placeholder="0" />
      </v-col>
      <revenue-commitment-checkbox v-model="baseline.revenueCommitment" />
    </v-row>
    <v-row justify="center">
      <app-button icon :svg="icons.add" @button-pressed="addBaseline" />
    </v-row>
  </fragment>
</template>

<script>
import RevenueCommitmentCheckbox from "../model-components/RevenueCommitmentCheckbox";
import { duplicateMixin } from "@/utils/mixins/component-specfic";
import { required, numeric } from "vuelidate/lib/validators";
import DisabledCondition from "../model-components/DisabledCondition.vue";
export default {
  name: "baseline-template",
  model: "Baseline",
  mixins: [duplicateMixin],
  data() {
    return {
      baselines: [
        { from: 0, to: Infinity, rate: null, revenueCommitment: false },
      ],
    };
  },
  // TODO: Validations
  validations: {
    baselines: {
      required,
      $each: {
        from: { required, numeric },
        to: { required, numeric },
        rate: { required, numeric },
      },
    },
  },
  components: {
    DisabledCondition,
    RevenueCommitmentCheckbox,
  },
  methods: {
    addBaseline() {
      const { to, rate } = this.baselines[this.lastIndex];
      this.baselines.push({
        from: to,
        to: Infinity,
        rate,
        revenueCommitment: false,
      });
    },
    updateThreshold(index) {
      const { from, to } = this.baselines[index];
      index > 0 && (this.baselines[index - 1].to = from);
      index !== this.lastIndex && (this.baselines[index + 1].from = to);
    },
  },
  computed: {
    lastIndex() {
      return this.baselines.length - 1;
    },
  },
};
</script>