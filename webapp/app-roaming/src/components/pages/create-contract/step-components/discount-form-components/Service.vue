<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          ref="selectBox"
          v-model="value.name"
          :items="services"
          placeholder="Select Service"
          :error-messages="serviceError"
        />
      </v-col>
      <v-col align-self="center" class="mr-3" cols="1">
        <v-icon :disabled="removeDisabled" @click="$emit('remove')">
          {{ `mdi-${icons.remove}` }}
        </v-icon>
      </v-col>
      <v-col align-self="center" class="mr-3" cols="1">
        <v-icon @click="$emit('add')">
          {{ `mdi-${icons.add}` }}
        </v-icon>
      </v-col>
    </v-row>
    <row label="Included in commitment?">
      <v-col>
        <v-checkbox v-model="value.includedInCommitment" />
      </v-col>
    </row>
    <row label="Usage Pricing Model">
      <v-col>
        <v-select
          v-model="value.pricingModel"
          :items="[
            'Not Charged',
            'Flat rate',
            'Linear rate',
            'Threshold - back to first',
            'Tiered with Thresholds',
            'Balanced/Unbalanced (Linear rate)',
          ]"
          placeholder="Select Model"
          :error-messages="pricingModelError"
        />
      </v-col>
    </row>
    <div v-if="value.pricingModel !== 'Not Charged'">
      <row label="Unit">
        <v-col>
          <v-text-field
            v-model="value.unit"
            placeholder="Usage unit to charge"
          />
        </v-col>
      </row>
    </div>
    <div v-if="value.pricingModel === 'Flat rate'">
      <row label="Rate">
        <rating-plan-input
          v-model="value.rate"
          :disable-thresholds="true"
          disable-linear="true"
        />
      </row>
    </div>
    <div v-if="value.pricingModel === 'Linear rate'">
      <row label="Rate">
        <rating-plan-input
          v-model="value.rate"
          :disable-thresholds="true"
          disable-fixed="true"
        />
      </row>
    </div>
    <div v-if="value.pricingModel === 'Threshold - back to first'">
      <row label="Rate">
        <rating-plan-input v-model="value.rate" />
      </row>
    </div>
    <div v-if="value.pricingModel === 'Tiered with Thresholds'">
      <row label="Rate">
        <rating-plan-input v-model="value.rate" />
      </row>
    </div>
    <div>
      <div v-if="value.pricingModel === 'Balanced/Unbalanced (Linear rate)'">
        <row label="Balanced Rate">
          <rating-plan-input
            v-model="value.balancedRate"
            :disable-thresholds="true"
            :disable-fixed="true"
          />
        </row>
        <row label="Unbalanced Rate">
          <rating-plan-input
            v-model="value.unbalancedRate"
            :disable-thresholds="true"
            :disable-fixed="true"
          />
        </row>
      </div>
    </div>
    <div>
      <div
        v-if="
          serviceConfiguration[value.name] &&
          serviceConfiguration[value.name].access
        "
      >
        <row label="Access Pricing Model">
          <v-col>
            <v-select
              :items="[
                'Not Charged',
                'Threshold - back to first',
                'Tiered with Thresholds',
              ]"
              placeholder="Select Model"
              v-model="value.accessPricingModel"
            />
          </v-col>
        </row>
      </div>
      <div
        v-if="
          value.accessPricingModel && value.accessPricingModel !== 'Not Charged'
        "
      >
        <row label="Unit">
          <v-col>
            <v-text-field
              v-model="value.accessPricingUnit"
              placeholder="Access unit to charge"
            />
          </v-col>
        </row>
      </div>
      <div v-if="value.accessPricingModel === 'Threshold - back to first'">
        <row label="Rate">
          <rating-plan-input v-model="value.accessPricingRate" />
        </row>
      </div>
      <div v-if="value.accessPricingModel === 'Tiered with Thresholds'">
        <row label="Rate">
          <rating-plan-input v-model="value.accessPricingRate" />
        </row>
      </div>
    </div>
  </div>
</template>
<script>
import ServiceValidation from '@validation/Service';
import RatingPlanInput from './RatingPlanInput.vue';
import {duplicateMixin} from '@mixins/component-specfic';
import {mapMutations, mapState} from 'vuex';

export const service = {
  id: 'service-0',
  name: null,
  rate: null,
  unit: null,
  balancedRate: null,
  unbalancedRate: null,
  pricingModel: null,
  accessPricingModel: null,
  accessPricingUnit: null,
  accessPricingRate: null,
  prevDefaultUnit: null,
  prevDefaultAccessUnit: null,
  includedInCommitment: false,
};

export default {
  name: 'service',
  description: 'description',
  mixins: [duplicateMixin],
  // data: () => ({service}),
  components: {
    RatingPlanInput,
  },
  ...ServiceValidation,
  props: {
    groupIndex: Number,
    serviceKey: String,
    from: String,
    value: {type: Object, required: true},
    removeDisabled: {type: Boolean, default: true},
  },
  watch: {
    value: {
      handler(val) {
        const key = `${this.serviceKey}-${this.from}`;
        this.addValidation({
          key,
          groupIndex: this.groupIndex,
          step: 'Discount Services',
          from: this.from,
          isInvalid: this.$v.$invalid,
          message: `${key} is missing a name and/or a pricing model`,
          validate: this.$v.$touch,
        });
        this.$emit('input', val);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('document/new', ['addValidation', 'updateValidation']),
  },
  computed: {
    serviceError() {
      const errors = [];
      if (!this.$v.value.name.$dirty) return errors;
      !this.$v.value.name.required && errors.push(`Service is required`);
      return errors;
    },
    pricingModelError() {
      const errors = [];
      if (!this.$v.value.pricingModel.$dirty) return errors;
      !this.$v.value.pricingModel.required &&
        errors.push(`Pricing Model is required`);
      return errors;
    },
    ...mapState(['services', 'serviceConfiguration']),
  },
  // beforeMount() {
  //   if (this.value) {
  //     this.service = this.value;
  //   }
  // },
};
</script>
