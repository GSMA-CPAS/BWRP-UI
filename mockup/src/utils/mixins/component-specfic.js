import { mapActions, mapGetters } from "vuex";
import { utilsMixin } from "./handle-data";
import {CONTRACT_STATE, DISCREPANCIES_STATUS} from "@/utils/Enums";
const bankFieldsMixin = {
  mixins: [utilsMixin],
  computed: {
    fields() {
      const bankLabels = [
        "Contact Name (Accounting)",
        "Contact Phone (Accounting)",
        "Contact Email (Accounting)",
        "Contact Name (Contract)",
        "Contact Phone (Contract)",
        "Contact Email (Contract)",
        "IBAN",
        "SWIFT/BIC",
        "Bank Name",
        "Bank Address",
        "Bank Account Name",
      ];
      return this.labelsToCamelCase(bankLabels);
    },
  },
};
export { bankFieldsMixin };
const duplicateMixin = {
  computed: {
    icons() {
      return {
        add: "plus",
        remove: "delete",
        edit: "pencil",
      };
    },
  },
};
export { duplicateMixin };

const validationMixin = {
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: {},
  methods: {
    // validate() {
    // this.valid &&
    // this.nextStep({
    //   key: this.$options.key,
    //   data: this.data
    // });
    // },

    ...mapActions("app-state", ["loadError"]),
    ...mapActions("contract/new", ["nextStep", "previousStep"]),
    requiredError(field) {
      const errors = [];
      if (!this.$v[field].$dirty) return errors;
      !this.$v[field].required &&
        errors.push(`${this._.startCase(field)} is required`);
      return errors;
    },
    emailError(field) {
      const errors = [];
      !this._.isNil(this.$v[field].email) &&
        !this.$v[field].email &&
        errors.push(`${this._.startCase(field)} is an invalid email`);
      return errors;
    },
    inputListeners(field) {
      return {
        // blur: () => this.$v[field].$touch(),
        input: () => this.$v[field].$touch(),
      };
    },
  },
  watch: {},
  computed: {
    ...mapGetters("contract/new", ["state", "partyMspids"]),
  },
  mounted() {},
};
export { validationMixin };
const discountModelsMixin = {
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: { data: Object },
  methods: {},
  watch: {},
  computed: {},
  mounted() {},
};
export { discountModelsMixin };

const timelineMixin = {
  mixins: [utilsMixin],
  methods: {
    ...mapActions("contract", ["loadContract","signContract","onUsageReportUploaded","upgradeContractState","acceptDiscrepancies","declineDiscrepancies"]),
    discrepanciesFlag: function (item){
      if(Math.abs(item.delta_percentage) === 0) return 'green-flag'
      else if(Math.abs(item.delta_percentage) <= 2) return 'yellow-flag'
      else return Math.abs(item.delta_percentage) > 4 ? 'red-flag' : 'orange-flag'
    }
  },
  data() {
    return {
      CONTRACT_STATE: CONTRACT_STATE,
      DISCREPANCIES_STATUS: DISCREPANCIES_STATUS
    }
  },
  computed: {
    cardTextStyle() {
      return {'ma-5': true};
    },
    ...mapGetters('document', ['exists']),
    ...mapGetters('contract', ["isSigned","contractState","isUploaded","discrepanciesStatus"])
  },
};
export {timelineMixin};
