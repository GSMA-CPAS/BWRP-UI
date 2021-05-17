import {required} from 'vuelidate/lib/validators';
export default {
  validations: {
    value: {
      name: {
        required,
      },
      pricingModel: {
        required,
      },
    },
  },
};
