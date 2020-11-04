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
  props: { data: Object },
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
  methods: {
    parseSignature(signature) {
      return `${signature?.name}, ${signature?.role}`;
    },
    ...mapActions("document/new", ["startContract"]),
    ...mapActions("partners", ["loadPartners"]),
    ...mapActions("document", ["loadData", "signDocument"]),
    ...mapGetters("document", ["exists"]),
  },
  computed: {
    ...mapState("app-state", ["signing"]),
    ...mapState("document", {
      bankDetails: (state) => state.document.data.bankDetails,
      generalInformation: (state) => state.document.data.generalInformation,
      contractSignatures: (state) => state.document.data.signatures,
    }),
    ...mapGetters("document", [
      "signatures",
      "parties",
      "name",
      "isSigned",
      "fromMSP",
      "toMSP",
    ]),
    ...mapGetters("partners", ["list"]),
  },
};
export { timelineMixin };

const validationMixin = {
  methods: {
    twoFormsValidate(key) {
      if (this.activeValidation) {
        var valid = false;
        const data = {};
        for (const key in this.$refs) {
          const { $v, _data } = this.$refs[key];
          data[key] = key === "signatures" ? _data.signatures : _data;
          const { $touch, $invalid } = $v;
          $touch();
          valid = !$invalid;
        }
        valid &&
          this.nextStep({
            key,
            data,
          });
      } else {
        const data = {};
        for (const party in this.$refs) {
          const { _data } = this.$refs[party];
          data[party] = key === "signatures" ? _data.signatures : _data;
        }
        this.nextStep({
          key,
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
  computed: {
    activeValidation: () => false,
    ...mapGetters("document/new", ["state", "msps"]),
  },
};
export { validationMixin };
