<template>
  <fragment>
    <form-container>
      <row label="Contract Name & Type">
        <v-col>
          <v-text-field
            label="Contract Name"
            v-on="inputListeners('name')"
            :error-messages="requiredError('name')"
            v-model="name"
          />
        </v-col>
        <v-col>
          <v-select
            label="Contract Type"
            v-on="inputListeners('type')"
            :error-messages="requiredError('type')"
            :items="contractTypes"
            v-model="type"
          />
        </v-col>
      </row>
      <row label="Start Date & End Date">
        <date-picker v-model="startDate" label="Start Date" />
        <date-picker
          v-model="endDate"
          :min="startDate"
          :disabled="endDateDisabled"
          label="End Date"
        />
      </row>
      <row label="Agreement Period & Prolongation Length">
        <v-col>
          <v-row>
            <v-text-field
              label="Agreement Period"
              suffix="months"
              :disabled="true"
              :value="agreementPeriod"
            />
            <help-tooltip
              padding="pa-2 pb-8"
              x-small
              text="Computes automatically"
            />
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-text-field
              label="Prolongation Length"
              :disabled="!active"
              :value="prolongationLength"
              suffix="months"
            />
            <tooltip
              tooltip-text="default prolongation length is 12 months, when active"
            >
              <template #activator="{ on }">
                <v-checkbox
                  class="ml-2 pa-2"
                  v-on="on"
                  v-model="active"
                ></v-checkbox>
              </template>
            </tooltip>
          </v-row>
        </v-col>
      </row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" :disabled="true" text />
      <app-button
        label="next"
        @button-pressed="validate('generalInformation')"
        @keydown.tab="validate('generalInformation')"
      />
    </div>
  </fragment>
</template>

<script>
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import moment from "moment";
import { validationMixin } from "@/utils/mixins/component-specfic";
import HelpTooltip from "@/components/other/HelpTooltip.vue";
import { computeDateDifference } from "@/utils/Utils";

export default {
  name: "step-1",
  description: "In this step, the general information of the contract is set.",
  data: () => ({
    name: null,
    type: null,
    startDate: null,
    endDate: null,
    prolongationLength: null,
    active: false,
  }),
  provide() {
    return {
      $v: this.$v,
    };
  },
  mixins: [validationMixin],
  validations: {
    name: { required },
    type: { required },
    startDate: { required, minValue: minValue(moment()._d) },
    endDate: {
      required,
      minValue: minValue(moment().add(1, "months")._d),
      maxValue: maxValue(moment().add(25, "years")._d),
    },
  },
  components: { HelpTooltip },
  watch: {
    active(isActive) {
      isActive
        ? (this.prolongationLength = 12)
        : (this.prolongationLength = null);
    },
  },
  computed: {
    endDateDisabled() {
      return this.startDate === null;
    },
    agreementPeriod() {
      const diff = computeDateDifference(this.startDate, this.endDate);
      return diff ? diff : null;
    },
    contractTypes() {
      return ["Normal", "Special"];
    },
  },
  beforeMount() {
    // TODO: check if imported data is correct
    const generalInformation = this.state("generalInformation");
    if (generalInformation) {
      const {
        name,
        type,
        startDate,
        endDate,
        prolongationLength,
      } = generalInformation;
      this.name = name;
      this.prolongationLength = prolongationLength;
      this.active = this.prolongationLength > 0;
      this.type = type;
      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
    }
  },
};
</script>