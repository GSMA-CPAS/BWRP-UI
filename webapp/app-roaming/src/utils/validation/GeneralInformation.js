import moment from 'moment';
import {required, minValue, maxValue} from 'vuelidate/lib/validators';

export default {
  validations: {
    name: {required},
    type: {required},
    startDate: {required, minValue: minValue(moment()._d)},
    endDate: {
      required,
      minValue: minValue(moment().add(1, 'months')._d),
      maxValue: maxValue(moment().add(25, 'years')._d),
    },
  },
};
