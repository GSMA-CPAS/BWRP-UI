<template>
  <div>
    <form-container>
      <row label="Contract Name">
        <!-- and Contract Type -->
        <v-col>
          <v-text-field
            label="Contract Name"
            v-on="inputListeners('name')"
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
import {required, minValue, maxValue} from 'vuelidate/lib/validators';
import moment from 'moment';
import {validationMixin} from '@/utils/mixins/component-specfic';
import HelpTooltip from '@/components/other/HelpTooltip.vue';
import {computeDateDifference} from '@/utils/Utils';
import Parties from '../step-components/Parties.vue';
import GeneralInformationPartyForm from '../step-components/discount-form-components/GeneralInformationPartyForm.vue';

export default {
  name: 'step-1',
  description: 'General Information',
  data: () => ({
    active: false,
  }),
  provide() {
    return {
      $v: this.$v,
    };
  },
  mixins: [validationMixin],
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
  components: {
    Parties,
    HelpTooltip,
    GeneralInformationPartyForm,
  },
  watch: {
    active(isActive) {
      isActive
        ? (this.prolongationLength = 12)
        : (this.prolongationLength = null);
    },
  },
  methods: {
    resetEndDate() {
      this.endDate = null;
    },
  },
  computed: {
    name: {
      get() {
        return this.$store.state.document.new.generalInformation.name;
      },
      set(value) {
        this.$store.commit('document/new/updateGeneralInformation', {
          key: 'name',
          value,
        });
      },
    },
    type: {
      get() {
        return this.$store.state.document.new.generalInformation.type;
      },
      set(value) {
        this.$store.commit('document/new/updateGeneralInformation', {
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
        this.$store.commit('document/new/updateGeneralInformation', {
          key: 'startDate',
          value,
        });
      },
    },
    endDate: {
      get() {
        return this.$store.state.document.new.generalInformation.endDate;
      },
      set(value) {
        this.$store.commit('document/new/updateGeneralInformation', {
          key: 'endDate',
          value,
        });
      },
    },
    prolongationLength: {
      get() {
        return this.$store.state.document.new.generalInformation
          .prolongationLength;
      },
      set(value) {
        this.$store.commit('document/new/updateGeneralInformation', {
          key: 'prolongationLength',
          value,
        });
      },
    },
    taxesIncluded: {
      get() {
        return this.$store.state.document.new.generalInformation.taxesIncluded;
      },
      set(value) {
        this.$store.commit('document/new/updateGeneralInformation', {
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
        this.$store.commit('document/new/updateGeneralInformation', {
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
        this.$store.commit('document/new/updateGeneralInformation', {
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
        this.$store.commit('document/new/updateGeneralInformation', {
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
      return diff > 0 ? diff : this.resetEndDate();
    },
    contractTypes() {
      return ['Normal', 'Special'];
    },
  },
};
</script>
