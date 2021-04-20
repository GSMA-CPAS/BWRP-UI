<template>
  <div>
    <form-container>
      <row label="Contract Name">
        <!-- and Contract Type -->
        <v-col>
          <v-text-field
            label="Contract Name"
            :error-messages="requiredError('name')"
            v-model="name"
          />
        </v-col>
        <!-- <v-col>
          <v-select
            label="Contract Type"
            v-on="inputListeners('type')"
            :error-messages="requiredError('type')"
            :items="contractTypes"
            v-model="type"
          />
        </v-col> -->
      </row>
      <row label="Start Date and End Date">
        <v-col>
          <date-picker v-model="startDate" label="Start Date" />
        </v-col>
        <v-col>
          <date-picker
            v-model="endDate"
            :min="startDate"
            :disabled="endDateDisabled"
            label="End Date"
          />
        </v-col>
      </row>
      <row label="Agreement Period and Prolongation Length">
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                label="Agreement Period"
                suffix="months"
                :disabled="true"
                :value="agreementPeriod"
              />
            </v-col>
            <v-col cols="1">
              <help-tooltip
                padding="pa-2 pb-8"
                x-small
                text="Computes automatically"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                label="Prolongation Length"
                :disabled="!active"
                v-model="prolongationLength"
                suffix="months"
              />
            </v-col>
            <v-col cols="1">
              <v-checkbox v-model="active" />
            </v-col>
          </v-row>
        </v-col>
      </row>
      <row label="Taxes and Authors">
        <v-col>
          <v-row>
            <v-col>
              <div class="v-text-field">
                {{ `Taxes ${taxesIncluded ? 'included' : 'excluded'}` }}
              </div>
            </v-col>
            <v-col cols="2">
              <v-checkbox v-model="taxesIncluded" />
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-text-field label="Authors" v-model="authors" />
        </v-col>
      </row>
      <v-divider />
      <parties label="Additional Information" />
      <v-row>
        <v-col><general-information-party-form v-model="userData" /></v-col>
        <v-divider vertical></v-divider>
        <v-col><general-information-party-form v-model="partnerData" /></v-col>
      </v-row>
    </form-container>
  </div>
</template>

<script>
import {validationMixin} from '@/utils/mixins/component-specfic';
import HelpTooltip from '@/components/other/HelpTooltip.vue';
import {computeDateDifference} from '@/utils/Utils';
import Parties from '../step-components/Parties.vue';
import GeneralInformationPartyForm from '../step-components/discount-form-components/GeneralInformationPartyForm.vue';
import {mapMutations} from 'vuex';
import GeneralInformationValidation from '@validation/GeneralInformation';

export default {
  name: 'step-1',
  description: 'General Information',
  provide() {
    return {
      $v: this.$v,
    };
  },
  mixins: [validationMixin],
  ...GeneralInformationValidation,
  components: {
    Parties,
    HelpTooltip,
    GeneralInformationPartyForm,
  },
  methods: {
    ...mapMutations('document/new', [
      'addValidation',
      'updateValidation',
      'updateGeneralInformation',
    ]),
    resetEndDate() {
      this.endDate = null;
    },
  },
  computed: {
    active: {
      get() {
        return this.prolongationLength > 0;
      },
      set(isActive) {
        isActive
          ? (this.prolongationLength = 12)
          : (this.prolongationLength = null);
      },
    },
    name: {
      get() {
        return this.$store.state.document.new.generalInformation.name;
      },
      set(value) {
        const key = 'name';
        this.updateGeneralInformation({
          key,
          value,
        });
        this.updateValidation({key, isInvalid: this.$v.name.$invalid});
      },
    },
    type: {
      get() {
        return this.$store.state.document.new.generalInformation.type;
      },
      set(value) {
        this.updateGeneralInformation({
          key: 'type',
          value,
        });
      },
    },
    startDate: {
      get() {
        return this.$store.state.document.new.generalInformation.startDate;
      },
      set(value) {
        const key = 'startDate';
        this.updateGeneralInformation({
          key,
          value,
        });
        this.updateValidation({key, isInvalid: this.$v.startDate.$invalid});
      },
    },
    endDate: {
      get() {
        return this.$store.state.document.new.generalInformation.endDate;
      },
      set(value) {
        const key = 'endDate';
        this.updateGeneralInformation({
          key,
          value,
        });
        this.updateValidation({key, isInvalid: this.$v.endDate.$invalid});
      },
    },
    prolongationLength: {
      get() {
        const prolongationLength = this.$store.state.document.new
          .generalInformation.prolongationLength;
        return prolongationLength;
      },
      set(value) {
        const key = 'prolongationLength';
        this.updateGeneralInformation({
          key,
          value,
        });
      },
    },
    taxesIncluded: {
      get() {
        return this.$store.state.document.new.generalInformation.taxesIncluded;
      },
      set(value) {
        this.updateGeneralInformation({
          key: 'taxesIncluded',
          value,
        });
      },
    },
    authors: {
      get() {
        return this.$store.state.document.new.generalInformation.authors;
      },
      set(value) {
        this.updateGeneralInformation({
          key: 'authors',
          value,
        });
      },
    },
    userData: {
      get() {
        return this.$store.state.document.new.generalInformation.userData;
      },
      set(value) {
        this.updateGeneralInformation({
          key: 'userData',
          value,
        });
      },
    },
    partnerData: {
      get() {
        return this.$store.state.document.new.generalInformation.partnerData;
      },
      set(value) {
        this.updateGeneralInformation({
          key: 'partnerData',
          value,
        });
      },
    },
    endDateDisabled() {
      return this.startDate === null;
    },
    agreementPeriod() {
      const diff = computeDateDifference(this.startDate, this.endDate);
      return diff > 0 ? diff : 0;
    },
    contractTypes() {
      return ['Normal', 'Special'];
    },
  },
  beforeMount() {
    this.addValidation({
      key: 'name',
      step: 'General Information',
      isInvalid: this.$v.name.$invalid,
      message: `Contract name is missing`,
      validate: this.$v.name.$touch,
    });
    this.addValidation({
      key: 'startDate',
      step: 'General Information',
      isInvalid: this.$v.startDate.$invalid,
      message: `[General Information] Start date is missing`,
      validate: this.$v.startDate.$touch,
    });
    this.addValidation({
      key: 'endDate',
      step: 'General Information',
      isInvalid: this.$v.endDate.$invalid,
      message: `[General Information] End date is missing`,
      validate: this.$v.endDate.$touch,
    });
  },
};
</script>
