import { mapActions, mapGetters, mapState } from "vuex";
import { utilsMixin } from "./handle-data";
const bankFieldsMixin = {
  mixins: [utilsMixin],
  computed: {
    fields() {
      const bankLabels = [
        "Currency",
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

const timelineMixin = {
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: {},
  methods: {
    parseSignature(signature) {
      return `${signature?.name}, ${signature?.role}`;
    },
  },
  watch: {},
  computed: {
    ...mapState("document", {
      fromMSP: (state) => state.document.fromMSP,
      toMSP: (state) => state.document.toMSP,
    }),
    ...mapGetters("document", ["signatures", "parties"]),
  },
  mounted() {},
};
export { timelineMixin };

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
    ...mapActions("document/new", ["nextStep", "previousStep"]),
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
    ...mapGetters("document/new", ["state", "msps"]),
  },
  mounted() {},
};
export { validationMixin };
