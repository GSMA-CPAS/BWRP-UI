
<template>
  <div>
    <v-stepper vertical :value="step">
      <div v-for="{content, index} in steps" :key="index">
        <v-stepper-step
          editable
          @click.native="setStep({index, totalSteps: steps.length})"
          :complete="step > index"
          :step="index"
        >
          {{ content.description }}
        </v-stepper-step>
        <v-stepper-items>
          <v-stepper-content :step="index">
            <component :ref="index" :is="content" />
          </v-stepper-content>
        </v-stepper-items>
      </div>
      <v-row class="mt-5">
        <app-button
          class="ml-8"
          label="Export Draft"
          @button-pressed="downloadDocument"
        />
        <v-spacer />
        <app-button
          @click="doSaveContract"
          class="mr-8"
          label="Save & Propose To Partner"
        />
      </v-row>
    </v-stepper>
  </div>
</template>
<script>
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
export default {
  name: 'stepper',
  description: 'Stepper used for contract-creation.',
  methods: {
    ...mapActions('document/new', ['saveContract', 'setStep']),
    ...mapMutations('document/new', ['resetState']),
    downloadDocument() {
      const contract = this.contract;
      delete contract.step;
      const data =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(contract));
      const link = document.createElement('a');
      link.href = data;
      link.setAttribute('download', 'contract.json');
      document.body.appendChild(link);
      link.click();
    },
    doSaveContract() {
      // TODO: Make validation more legible
      this.$refs[1][0].$v.$touch();

      this.saveContract().catch((e) => {
        this.$store.dispatch('app-state/loadError', {
          title: 'Error saving contract',
          body:
            'Could not save contract - the contract information may be incomplete or filled incorrectly',
        });
      });
    },
  },
  computed: {
    ...mapGetters('document/new', ['contract']),
    ...mapState('document/new', ['step']),
    steps() {
      const components = require.context(
        './steps/',
        false,
        /(Step-).*.(vue|js)$/,
      );
      let i = 1;
      const steps = components
        .keys()
        .map((x) => ({content: components(x).default, index: i++}));
      return steps;
    },
  },
  beforeDestroy() {
    this.resetState();
  },
};
</script>
