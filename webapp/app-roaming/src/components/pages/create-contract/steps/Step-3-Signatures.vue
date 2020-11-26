<template>
  <fragment>
    <form-container>
      <parties label="signatures" />
      <v-row>
        <signature-form :ref="msps.user" v-model="userSignatures" />
        <v-divider vertical />
        <signature-form :ref="msps.partner" v-model="partnerSignatures" />
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
      <app-button
        label="next"
        @button-pressed="twoFormsValidate('signatures')"
        @keydown="twoFormsValidate('signatures')"
      />
    </div>
  </fragment>
</template>
<script>
import Parties from '../step-components/Parties.vue';
import SignatureForm from '../step-components/SignatureForm.vue';
import {validationMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'step-3',
  description: 'Signatures',
  mixins: [validationMixin],
  components: {
    SignatureForm,
    Parties,
  },
  computed: {
    userSignatures: {
      get() {
        return this.$store.state.document.new.userData.signatures;
      },
      set(value) {
        this.$store.commit('document/new/updateSignatures', {
          key: 'userData',
          value,
        });
      },
    },
    partnerSignatures: {
      get() {
        return this.$store.state.document.new.partnerData.signatures;
      },
      set(value) {
        this.$store.commit('document/new/updateSignatures', {
          key: 'partnerData',
          value,
        });
      },
    },
  },
};
</script>
