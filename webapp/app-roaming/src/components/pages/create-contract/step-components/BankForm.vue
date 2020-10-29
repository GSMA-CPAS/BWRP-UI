<template>
  <v-col>
    <currency-selector v-model="_data.currency" />
    <v-text-field
      v-for="{ key, label } in fields"
      :key="key"
      v-model="_data[key]"
      validate-on-blur
      v-on="inputListeners(key)"
      :error-messages="[...requiredError(key), ...emailError(key)]"
      :label="label"
    />
  </v-col>
</template>
<script>
import { required, email } from "vuelidate/lib/validators";
import {
  validationMixin,
  bankFieldsMixin,
} from "@/utils/mixins/component-specfic";
export default {
  name: "bank-form",
  description: "This is the bank form",
  mixins: [validationMixin, bankFieldsMixin],
  props: { data: { type: Object, default: null } },
  data() {
    return {
      currency: null,
      contactNameAccounting: null,
      contactPhoneAccounting: null,
      contactEmailAccounting: null,
      contactNameContract: null,
      contactPhoneContract: null,
      contactEmailContract: null,
      iban: null,
      swiftBic: null,
      bankName: null,
      bankAddress: null,
      bankAccountName: null,
    };
  },
  provide() {
    return {
      currencyValidator: this.$v.currency,
    };
  },
  validations() {
    const validations = {};
    for (const key in this._data) {
      validations[key] = {
        required,
      };
    }
    validations.contactEmailAccounting.email = email;
    validations.contactEmailContract.email = email;
    return validations;
  },
  mounted() {
    if (this.data) {
      for (const key in this._data) {
        this._data[key] = this.data[key];
      }
    }
  },
};
</script>