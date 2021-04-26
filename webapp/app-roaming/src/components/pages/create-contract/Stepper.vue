
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
          <div
            :class="{
              'error--text':
                saveAttempt &&
                validation.some(
                  ({step, isInvalid}) =>
                    step === content.description && isInvalid,
                ),
            }"
          >
            {{ content.description }}
          </div>
        </v-stepper-step>
        <v-stepper-items>
          <v-stepper-content :step="index">
            <component :ref="index" :is="content" />
          </v-stepper-content>
        </v-stepper-items>
      </div>
      <v-row class="mt-5">
        <app-button
          class="ml-6"
          label="Export Draft"
          @button-pressed="exportDraft"
        />
        <v-spacer />
        <app-button
          @click="doSaveContract"
          class="mr-6"
          label="Save & Propose To Partner"
        />
      </v-row>
    </v-stepper>
  </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex';
export default {
  name: 'stepper',
  title: 'Create Contract',
  description: 'Stepper used for contract-creation.',
  methods: {
    ...mapActions('document/new', [
      'saveContract',
      'setStep',
      'getContractData',
    ]),
    ...mapMutations('document/new', ['resetState']),
    exportDraft() {
      const contract = this.getContractData();
      delete contract.step;
      const data = new Blob([JSON.stringify(contract)], {
        type: 'data:application/json',
      });
      const fileName = `contract-draft.json`;

      if (window.navigator.msSaveOrOpenBlob) {
        // ie11
        window.navigator.msSaveOrOpenBlob(data, fileName);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = fileName;
        link.href = window.URL.createObjectURL(data);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    doSaveContract() {
      // TODO: Make validation more legible

      this.saveContract().catch((e) => {
        const {title, body} = e;
        this.$store.dispatch('app-state/loadError', {
          title,
          body,
        });
      });
    },
  },
  computed: {
    ...mapState('document/new', ['step', 'saveAttempt', 'validation']),
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
