import {mapActions, mapGetters, mapState} from 'vuex';
import {utilsMixin} from './handle-data';
const bankFieldsMixin = {
  mixins: [utilsMixin],
  computed: {
    fields() {
      const bankLabels = [
        'Contact Name (Accounting)',
        'Contact Phone (Accounting)',
        'Contact Email (Accounting)',
        'Contact Name (Contract)',
        'Contact Phone (Contract)',
        'Contact Email (Contract)',
        'IBAN',
        'SWIFT/BIC',
        'Bank Name',
        'Bank Address',
        'Bank Account Name',
      ];
      return this.labelsToCamelCase(bankLabels);
    },
  },
};
export {bankFieldsMixin};

const discountModelsMixin = {
  props: {data: Object},
};
export {discountModelsMixin};

const duplicateMixin = {
  computed: {
    icons() {
      return {
        view: 'eye',
        add: 'plus',
        minus: 'minus',
        remove: 'delete',
        edit: 'pencil',
      };
    },
  },
};
export {duplicateMixin};

const appDetailsMixin = {
  computed: {...mapGetters('app-details', ['version'])},
};

export {appDetailsMixin};
const appStateMixin = {
  methods: {
    ...mapActions('app-state', ['setErrorVisibility']),
  },
  computed: {
    ...mapState('app-state', [
      'errorResponse',
      'showError',
      'isLoading',
      'hideOverlay',
    ]),
  },
};
export {appStateMixin};

const timelineMixin = {
  mixins: [utilsMixin],
  methods: {
    parseSignature(signature) {
      return `${signature?.name}, ${signature?.role}`;
    },
    ...mapActions('document/new', ['startContract']),
    ...mapActions('partners', ['loadPartners']),
    ...mapActions('document', ['loadData', 'signDocument']),
    ...mapGetters('document', ['exists']),
  },
  computed: {
    cardTextStyle() {
      return {'ma-5': true};
    },
    ...mapState('app-state', ['signing']),
    ...mapState('document', {
      documentData: (state) => state.document.data,
      signatures: (state) => state.signatures,
    }),
    ...mapGetters('document', [
      'bankDetails',
      'parties',
      'contractId',
      'creationDate',
      'isSigned',
      'partnerMsp',
      'selfMsp',
      'partnerMsp',
    ]),
    ...mapGetters('partners', ['list']),
  },
};
export {timelineMixin};

const validationMixin = {
  methods: {
    ...mapActions('app-state', ['loadError']),
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
    ...mapGetters('document/new', ['msps']),
  },
};
export {validationMixin};
