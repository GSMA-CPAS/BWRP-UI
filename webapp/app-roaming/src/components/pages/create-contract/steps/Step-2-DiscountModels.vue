<template>
  <form-container>
    <parties label="Discount Models" label-extra-classes="grey--text" />
    <v-row>
      <discount-form
        :from="msps.user"
        v-model="userDiscountModels"
        :home-tadigs="userTadigs"
        :visitor-tadigs="partnerTadigs"
        v-on:copy-other-side="copyFromUserSide"
        :key="'user' + userComponentKey"
        :default-currency="userDefaultCurrency"
      />
      <v-divider vertical />
      <discount-form
        :from="msps.partner"
        v-model="partnerDiscountModels"
        :home-tadigs="partnerTadigs"
        :visitor-tadigs="userTadigs"
        v-on:copy-other-side="copyFromPartnerSide"
        :key="'partner' + partnerComponentKey"
        :default-currency="partnerDefaultCurrency"
      />
    </v-row>
  </form-container>
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
  data() {
    return {
      userComponentKey: 0,
      partnerComponentKey: 0,
    };
  },
  methods: {
    copyFromUserSide(data) {
      this.copySide('user', 'partner');
    },
    copyFromPartnerSide(data) {
      this.copySide('partner', 'user');
    },
    copySide(from, to) {
      if (
        confirm(
          `Are you sure you want to copy the discount and condition information from ${this.msps[from]} side to ${this.msps[to]} side overriding any existing information in ${this.msps[to]}?`,
        )
      ) {
        let data;
        if (from === 'user') {
          data = this.userDiscountModels;
        } else if (from === 'partner') {
          data = this.partnerDiscountModels;
        }

        // Clone the data to disconnect sides
        data = JSON.parse(JSON.stringify(data));

        for (const sg of data.serviceGroups) {
          const tmpTadigs = sg.homeTadigs;
          sg.homeTadigs = sg.visitorTadigs;
          sg.visitorTadigs = tmpTadigs;
        }

        if (to === 'user') {
          this.userDiscountModels = data;
        } else if (to === 'partner') {
          this.partnerDiscountModels = data;
        }

        this.userComponentKey += 1;
        this.partnerComponentKey += 1;
      }
    },
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
      return this.$store.state.document.new.generalInformation?.userData
        ?.tadigCodes?.codes;
    },
    partnerTadigs() {
      return this.$store.state.document.new.generalInformation?.partnerData
        ?.tadigCodes?.codes;
    },
    userDefaultCurrency() {
      return this.$store.state.document.new.generalInformation.userData
        ?.currencyForAllDiscounts;
    },
    partnerDefaultCurrency() {
      return this.$store.state.document.new.generalInformation.partnerData
        ?.currencyForAllDiscounts;
    },
  },
};
</script>
