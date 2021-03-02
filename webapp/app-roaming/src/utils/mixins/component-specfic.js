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
    ...mapActions('document/new', ['startContract']),
    ...mapActions('partners', ['loadPartners']),
    ...mapActions('document', ['loadData', 'signDocument']),
    ...mapActions('user', ['loadIdentities']),
    ...mapGetters('document', ['exists']),
  },
  computed: {
    cardTextStyle() {
      return {'ma-5': true};
    },
    ...mapState('user', ['identities']),
    ...mapState('app-state', ['signing']),
    ...mapState('document', {
      referenceId: (state) => state.document.referenceId,
      blockchainTxId: (state) => state.document.blockchainRef.txId,
      documentData: (state) => state.document.data,
      headerData: (state) => state.document.header,
      rawData: (state) => state.rawData.raw,
      signatures: (state) => state.signatures,
      creationDate: (state) => state.creationDate,
    }),
    ...mapGetters('document', [
      'bankDetails',
      'parties',
      'contractId',
      'creationDate',
      'isSigned',
      'totalSignatures',
      'partnerMsp',
      'selfMsp',
      'partnerMsp',
      'minSignaturesSelf',
      'minSignaturesPartner',
    ]),
    ...mapGetters('partners', ['list'])
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
