<template>
  <v-col>
    <currency-selector v-model="value.currency" />
    <v-text-field
      v-for="{key, label} in fields"
      :key="key"
      v-model="value[key]"
      validate-on-blur
      v-on="inputListeners(key)"
      :error-messages="[...requiredError(key), ...emailError(key)]"
      :label="label"
    />
  </v-col>
</template>
<script>
import {required} from 'vuelidate/lib/validators';
import {validationMixin, bankFieldsMixin} from '@mixins/component-specfic';
export default {
  name: 'bank-form',
  description: 'This is the bank form',
  mixins: [validationMixin, bankFieldsMixin],
  props: {value: {type: Object, default: null}},
  provide() {
    return {
      currencyValidator: this.$v.currency,
    };
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
  validations() {
    const validations = {};
    for (const key in this.value) {
      if (Object.prototype.hasOwnProperty.call(this.value, key)) {
        validations[key] = {
          required,
        };
      }
    }
    // validations.contactEmailAccounting.email = email;
    // validations.contactEmailContract.email = email;
    return validations;
  },
};
</script>
