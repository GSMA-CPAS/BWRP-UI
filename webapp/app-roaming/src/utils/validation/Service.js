import {required} from 'vuelidate/lib/validators';
export default {
  validations: {
    service: {
      name: {
        required,
      },
      pricingModel: {
        required,
      },
    },
  },
};
