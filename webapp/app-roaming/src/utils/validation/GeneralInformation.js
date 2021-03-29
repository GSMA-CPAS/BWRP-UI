/* import moment from 'moment'; */
import {required, /* minValue */} from 'vuelidate/lib/validators';
/* add minValue if date needs to be specific */
export default {
  validations: {
    name: {required},
    type: {required},
    startDate: {required, /*  minValue: minValue(moment()._d)*/},
    endDate: {
      required,
     /*  minValue: minValue(moment().add(1, 'months')._d), */
    },
  },
};
