<template>
  <form-container>
    <parties label="Signatures" />
    <v-row>
      <signature-form-v2 v-model="userSignatures" />
      <!-- <signature-form :ref="msps.user" v-model="userSignatures" /> -->
      <v-divider vertical />
      <signature-form-v2 v-model="partnerSignatures" />
      <!-- <signature-form :ref="msps.partner" v-model="partnerSignatures" /> -->
    </v-row>
  </form-container>
</template>
<script>
import Parties from '../step-components/Parties.vue';
import SignatureFormV2 from '../step-components/signature-forms/SignatureFormV2.vue';
import {
  duplicateMixin,
  validationMixin,
} from '@/utils/mixins/component-specfic';
export default {
  name: 'step-3',
  description: 'Signatures',
  mixins: [validationMixin, duplicateMixin],
  components: {
    SignatureFormV2,
    Parties,
  },
  computed: {
    userSignatures: {
      get() {
        return this.$store.state.document.new.userData.signatures.minSignatures;
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
        return this.$store.state.document.new.partnerData.signatures
          .minSignatures;
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
