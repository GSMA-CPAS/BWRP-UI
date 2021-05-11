<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          v-model="service.name"
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
        <v-checkbox v-model="service.includedInCommitment" />
      </v-col>
    </row>
    <row label="Usage Pricing Model">
      <v-col>
        <v-select
          v-model="service.pricingModel"
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
    <div v-if="service.pricingModel !== 'Not Charged'">
      <row label="Unit">
        <v-col>
          <v-text-field
            v-model="service.unit"
            placeholder="Usage unit to charge"
          />
        </v-col>
      </row>
    </div>
    <div v-if="service.pricingModel === 'Flat rate'">
      <row label="Rate">
        <rating-plan-input
          v-model="service.rate"
          :disable-thresholds="true"
          disable-linear="true"
        />
      </row>
    </div>
    <div v-if="service.pricingModel === 'Linear rate'">
      <row label="Rate">
        <rating-plan-input
          v-model="service.rate"
          :disable-thresholds="true"
          disable-fixed="true"
        />
      </row>
    </div>
    <div v-if="service.pricingModel === 'Threshold - back to first'">
      <row label="Rate">
        <rating-plan-input v-model="service.rate" />
      </row>
    </div>
    <div v-if="service.pricingModel === 'Tiered with Thresholds'">
      <row label="Rate">
        <rating-plan-input v-model="service.rate" />
      </row>
    </div>
    <div>
      <div v-if="service.pricingModel === 'Balanced/Unbalanced (Linear rate)'">
        <row label="Balanced Rate">
          <rating-plan-input
            v-model="service.balancedRate"
            :disable-thresholds="true"
            :disable-fixed="true"
          />
        </row>
        <row label="Unbalanced Rate">
          <rating-plan-input
            v-model="service.unbalancedRate"
            :disable-thresholds="true"
            :disable-fixed="true"
          />
        </row>
      </div>
    </div>
    <div>
      <div
        v-if="
          serviceConfiguration[service.name] &&
          serviceConfiguration[service.name].access
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
              v-model="service.accessPricingModel"
            />
          </v-col>
        </row>
      </div>
      <div
        v-if="
          service.accessPricingModel &&
          service.accessPricingModel !== 'Not Charged'
        "
      >
        <row label="Unit">
          <v-col>
            <v-text-field
              v-model="service.accessPricingUnit"
              placeholder="Access unit to charge"
            />
          </v-col>
        </row>
      </div>
      <div v-if="service.accessPricingModel === 'Threshold - back to first'">
        <row label="Rate">
          <rating-plan-input v-model="service.accessPricingRate" />
        </row>
      </div>
      <div v-if="service.accessPricingModel === 'Tiered with Thresholds'">
        <row label="Rate">
          <rating-plan-input v-model="service.accessPricingRate" />
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
  data: () => ({service}),
  components: {
    RatingPlanInput,
  },
  ...ServiceValidation,
  props: {
    serviceKey: String,
    from: String,
    value: {type: Object, required: true},
    removeDisabled: {type: Boolean, default: true},
  },
  watch: {
    service: {
      handler(val) {
        this.addValidation({
          key: `discountService${this.from}-${this.serviceKey}`,
          step: 'Discount Models',
          from: this.from,
          isInvalid: this.$v.$invalid,
          message: `${service.id} is missing a name and/or a pricing model`,
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
      if (!this.$v.service.name.$dirty) return errors;
      !this.$v.service.name.required && errors.push(`Service is required`);
      return errors;
    },
    pricingModelError() {
      const errors = [];
      if (!this.$v.service.pricingModel.$dirty) return errors;
      !this.$v.service.pricingModel.required &&
        errors.push(`Pricing Model is required`);
      return errors;
    },
    ...mapState(['services', 'serviceConfiguration']),
  },
  beforeMount() {
    if (this.value) {
      this.service = this.value;
    }
  },
};
</script>
