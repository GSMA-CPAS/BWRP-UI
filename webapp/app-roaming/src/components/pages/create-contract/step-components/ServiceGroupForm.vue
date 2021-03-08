<template>
  <v-col>
    <br />
    <b>TADIGs</b>
    <row label="Home TADIGs">
      <v-col>
        <tadig-codes v-model="homeTadigs"/>
      </v-col>
    </row>
    <row label="Visitor TADIGs">
      <v-col>
        <tadig-codes v-model="visitorTadigs"/>
      </v-col>
    </row>
    <br />
    <b>Services</b>
    <fragment v-for="(service, index) in chosenServices" :key="service.id">
      <v-row>
        <v-col>
          <v-select
            v-model="service.name"
            :items="services"
            placeholder="Select Service"
          />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <v-icon :disabled="isDisabled" @click="removeService(index)">
            {{ `mdi-${icons.remove}` }}
          </v-icon>
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <v-icon @click="addService">
            {{ `mdi-${icons.add}` }}
          </v-icon>
        </v-col>
      </v-row>
      <row label="Included in commitment?">
        <v-col><v-checkbox v-model="service.includedInCommitment"></v-checkbox></v-col>
      </row>
      <row label="Usage Pricing Model">
        <v-col>
          <v-select
            :items="['Not Charged', 'Flat rate', 'Linear rate', 'Threshold - back to first', 'Tiered with Thresholds', 'Balanced/Unbalanced (Linear rate)']"
            placeholder="Select Model"
            v-model="service.pricingModel"
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
          <rating-plan-input v-model="service.rate" disable-thresholds="true" disable-linear="true"/>
        </row>
      </div>
      <div v-if="service.pricingModel === 'Linear rate'">
        <row label="Rate">
          <rating-plan-input v-model="service.rate" disable-thresholds="true" disable-fixed="true"/>
        </row>
      </div>
      <div v-if="service.pricingModel === 'Threshold - back to first'">
        <row label="Rate">
          <rating-plan-input v-model="service.rate"/>
        </row>
      </div>
      <div v-if="service.pricingModel === 'Tiered with Thresholds'">
        <row label="Rate">
          <rating-plan-input v-model="service.rate"/>
        </row>
      </div>
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
      <row v-if="serviceConfiguration[service.name] && serviceConfiguration[service.name].access" label="Access Pricing Model">
        <v-col>
          <v-select
            :items="['Not Charged', 'Threshold - back to first', 'Tiered with Thresholds']"
            placeholder="Select Model"
            v-model="service.accessPricingModel"
          />
        </v-col>
      </row>
      <div v-if="service.accessPricingModel && service.accessPricingModel !== 'Not Charged'">
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
          <rating-plan-input v-model="service.accessPricingRate"/>
        </row>
      </div>
      <div v-if="service.accessPricingModel === 'Tiered with Thresholds'">
        <row label="Rate">
          <rating-plan-input v-model="service.accessPricingRate"/>
        </row>
      </div>
    </fragment>
  </v-col>
</template>
<script>
import {mapState} from 'vuex';
import {duplicateMixin} from '../../../../utils/mixins/component-specfic';
import RatingPlanInput from './discount-form-components/RatingPlanInput';
import Vue from 'vue';
import TadigCodes from '@/components/pages/create-contract/step-components/general-information/TadigCodes';

export default {
  name: 'service-group-form',
  description: 'description',
  mixins: [duplicateMixin],
  props: ['homeTadigOptions', 'visitorTadigOptions', 'value'],
  components: {
    RatingPlanInput,
    TadigCodes
  },
  data() {
    return {
      homeTadigs: {codes: []},
      visitorTadigs: {codes: []},
      chosenServices: [
        {
          id: 'service-0',
          name: null,
          rate: null,
          unit: null,
          balancedRate: null,
          unbalancedRate: null,
          pricingModel: 'Normal',
          accessPricingModel: null,
          accessPricingUnit: null,
          accessPricingRate: null,
          prevDefaultUnit: null,
          prevDefaultAccessUnit: null,
          includedInCommitment: true,
        },
      ],
    };
  },
  watch: {
    chosenServices: {
      handler() {
        // Set default units if missing
        for ( const s of this.chosenServices ) {
          if ( this.serviceConfiguration[s.name] ) {
            if ( this.serviceConfiguration[s.name].unit &&
                s.unit !== this.serviceConfiguration[s.name].unit &&
                ( s.unit === '' || s.unit === undefined || s.unit === null || s.unit === s.prevDefaultUnit ) ) {
              Vue.nextTick(() => {
                s.unit = this.serviceConfiguration[s.name].unit;
                this.$forceUpdate();
              });
            }
            s.prevDefaultUnit = this.serviceConfiguration[s.name].unit;
          }

          if ( this.serviceConfiguration[s.name] && this.serviceConfiguration[s.name].access ) {
            if ( this.serviceConfiguration[s.name].accessUnit &&
                s.accessPricingUnit !== this.serviceConfiguration[s.name].accessUnit &&
                ( s.accessPricingUnit === '' || s.accessPricingUnit === undefined || s.accessPricingUnit === null || s.accessPricingUnit === s.prevDefaultAccessUnit ) ) {
              Vue.nextTick(() => {
                s.accessPricingUnit = this.serviceConfiguration[s.name].accessUnit;
                this.$forceUpdate();
              });
            }
            s.prevDefaultAccessUnit = this.serviceConfiguration[s.name].accessUnit;
          }
        }

        this.$emit('input', this.$data);
      },
      deep: true,
    },
    homeTadigs: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    visitorTadigs: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    condition: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
  },
  methods: {
    addService() {
      this.chosenServices.push({
        id: `service-${this.chosenServices.length}`,
        name: null,
        includedInCommitment: true,
      });
    },
    removeService(index) {
      this.chosenServices.splice(index, 1);
    },
  },
  computed: {
    ...mapState(['services', 'serviceConfiguration']),
    isDisabled() {
      return this.chosenServices.length === 1;
    },
  },
  beforeMount() {
    if (this.value) {
      this.visitorTadigs = this.value.visitorTadigs;
      this.homeTadigs = this.value.homeTadigs;
      this.condition = this.value.condition;
      this.chosenServices = this.value.chosenServices;
    }

    // Initialize the tadigs so we don't get undefined errors
    if ( this.homeTadigs === undefined ) {
      this.homeTadigs = {
        codes: []
      };
    }

    if ( this.visitorTadigs === undefined ) {
      this.visitorTadigs = {
        codes: []
      };
    }

    if (!this.chosenServices || this.chosenServices.length === 0) {
      this.chosenServices = [
        {
          id: 'service-0',
          name: null,
          rate: null,
          unit: null,
          balancedRate: null,
          unbalancedRate: null,
          pricingModel: 'Normal',
          accessPricingModel: 'Not Charged',
          accessPricingUnit: null,
          accessPricingRate: null,
          includedInCommitment: true,
        },
      ];
    }
  },
};
</script>
