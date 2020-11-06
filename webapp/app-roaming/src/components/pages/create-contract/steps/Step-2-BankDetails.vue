<template>
  <fragment>
    <form-container>
      <parties label="bank details" />
      <v-row>
        <bank-form :ref="msps.user" :data="bankDetails[msps.user]" />
        <v-divider vertical />
        <bank-form :ref="msps.partner" :data="bankDetails[msps.partner]" />
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
import { validationMixin } from "@/utils/mixins/component-specfic";
import BankForm from "../step-components/BankForm.vue";
import Parties from "../step-components/Parties.vue";
export default {
  name: "step-1",
  description: "In this step, the bank details of the contract are drafted.",
  mixins: [validationMixin],
  components: {
    BankForm,
    Parties,
  },
  computed: {
    bankDetails() {
      return this.state("bankDetails") || { bankDetails: null };
    },
  },
};
</script>