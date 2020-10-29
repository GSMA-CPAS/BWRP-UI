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

const appStateMixin = {
  methods: {
    ...mapActions("app-state", ["setErrorVisibility"]),
  },
  computed: {
    ...mapState("app-state", [
      "errorResponse",
      "showError",
      "isLoading",
      "hideOverlay",
    ]),
  },
};
export { appStateMixin };

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
    ...mapActions("document/new", ["startContract"]),
    ...mapActions("partners", ["loadPartners"]),
    ...mapActions("document", ["loadData"]),
    ...mapGetters("document", ["exists"]),
  },
  watch: {},
  computed: {
    ...mapState("document", {
      fromMSP: (state) => state.document.fromMSP,
      toMSP: (state) => state.document.toMSP,
      bankDetails: (state) => state.document.data.bankDetails,
      generalInformation: (state) => state.document.data.generalInformation,
      signatures: (state) => state.document.data.signatures,
    }),
    ...mapGetters("document", ["signatures", "parties", "name"]),
    ...mapGetters("partners", ["list"]),
  },
};
export { timelineMixin };

const validationMixin = {
  data() {
    return { activeValidation: false };
  },
  methods: {
    twoFormsValidate() {
      if (this.activeValidation) {
        var valid = false;
        const data = {};
        for (const key in this.$refs) {
          const { $v, _data } = this.$refs[key];
          data[key] = _data;
          const { $touch, $invalid } = $v;
          $touch();
          valid = !$invalid;
        }
        valid &&
          this.nextStep({
            key: "bankDetails",
            data,
          });
      } else {
        const data = {};
        for (const key in this.$refs) {
          const { _data } = this.$refs[key];
          data[key] = _data;
        }
        this.nextStep({
          key: "bankDetails",
          data,
        });
      }
    },
    validate(key) {
      if (this.activeValidation) {
        const { $touch, $invalid } = this.$v;
        $touch();
        const valid = !$invalid;
        valid &&
          delete this._data.active &&
          this.nextStep({
            key,
            data: this._data,
          });
      } else {
        delete this._data.active &&
          this.nextStep({
            key,
            data: this._data,
          });
      }
    },

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
