<template>
  <fragment>
    <form-container>
      <parties label="bank details" />
      <v-row>
        <bank-form
          :ref="partyMspids.user"
          :data="bankDetails[partyMspids.user]"
        />
        <v-divider vertical />
        <bank-form
          :ref="partyMspids.partner"
          :data="bankDetails[partyMspids.partner]"
        />
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
      <app-button label="next" @button-pressed="validate" />
    </div>
  </fragment>
</template>
<script>
import { validationMixin } from "../../../../utils/mixins/component-specfic";
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
  methods: {
    validate() {
      // var valid = false;
      var data = {};
      for (const key in this.$refs) {
        const { /* $v, */ _data } = this.$refs[key];
        data[key] = _data;
        // const { $touch, $invalid } = $v;
        // $touch();
        // valid = !$invalid;
      }
      // valid &&
      this.nextStep({
        key: "bankDetails",
        data,
      });
    },
  },
};
</script>