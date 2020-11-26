<template>
  <fragment>
    <form-container>
      <parties label="bank details" />
      <v-row>
        <bank-form :ref="msps.user" v-model="userBankDetails" />
        <v-divider vertical />
        <bank-form :ref="msps.partner" v-model="partnerBankDetails" />
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
      <app-button
        label="next"
        @button-pressed="twoFormsValidate('bankDetails')"
        @keydown.tab="twoFormsValidate('bankDetails')"
      />
    </div>
  </fragment>
</template>
<script>
import {validationMixin} from '@/utils/mixins/component-specfic';
import BankForm from '../step-components/BankForm.vue';
import Parties from '../step-components/Parties.vue';
export default {
  name: 'step-1',
  description: 'Bank Details',
  mixins: [validationMixin],
  components: {
    BankForm,
    Parties,
  },
  computed: {
    userBankDetails: {
      get() {
        return this.$store.state.document.new.userData.bankDetails;
      },
      set(value) {
        this.$store.commit('document/new/updateBankDetails', {
          key: 'userData',
          value,
        });
      },
    },
    partnerBankDetails: {
      get() {
        return this.$store.state.document.new.partnerData.bankDetails;
      },
      set(value) {
        this.$store.commit('document/new/updateBankDetails', {
          key: 'partnerData',
          value,
        });
      },
    },
  },
};
</script>
