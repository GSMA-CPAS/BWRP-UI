<template>
  <fragment>
    <form-container>
      <parties label="Discount Models" />
      <v-row>
        <discount-form :ref="msps.user" v-model="userDiscountModels" :home-tadigs="userTadigs" :visitor-tadigs="partnerTadigs"/>
        <v-divider vertical />
        <discount-form :ref="msps.partner" v-model="partnerDiscountModels"  :home-tadigs="partnerTadigs" :visitor-tadigs="userTadigs"/>
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
    </div>
  </fragment>
</template>
<script>
import Parties from '../step-components/Parties.vue';
import {validationMixin} from '@/utils/mixins/component-specfic';
import DiscountForm from '../step-components/DiscountForm.vue';

export default {
  name: 'step-4',
  description: 'Discount Models',
  mixins: [validationMixin],
  components: {
    Parties,
    DiscountForm,
    //    ConditionForm,
  },
  computed: {
    userDiscountModels: {
      get() {
        return this.$store.state.document.new.userData.discountModels;
      },
      set(value) {
        this.$store.commit('document/new/updateDiscountModels', {
          key: 'userData',
          value,
        });
      },
    },
    partnerDiscountModels: {
      get() {
        return this.$store.state.document.new.partnerData.discountModels;
      },
      set(value) {
        this.$store.commit('document/new/updateDiscountModels', {
          key: 'partnerData',
          value,
        });
      },
    },
    userTadigs() {
      return this.$store.state.document.new.generalInformation?.userData?.tadigCodes?.codes?.split(',');
    },
    partnerTadigs() {
      return this.$store.state.document.new.generalInformation?.partnerData?.tadigCodes?.codes?.split(',');
    },
  }
};
</script>
