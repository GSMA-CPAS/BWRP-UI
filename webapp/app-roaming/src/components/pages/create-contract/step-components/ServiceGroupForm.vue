<template>
  <v-col>
    <br />
    <b>TADIGs</b>
    <row label="Home TADIGs">
      <v-col>
        <v-autocomplete
          v-model="homeTadigs"
          multiple
          :items="$props.homeTadigOptions"
          label="TADIGs"
          placeholder="All (Default)"
        />
      </v-col>
    </row>
    <row label="Visitor TADIGs">
      <v-col>
        <v-autocomplete
          v-model="visitorTadigs"
          multiple
          :items="$props.visitorTadigOptions"
          label="TADIGs"
          placeholder="All (Default)"
        />
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
      <row label="Usage Pricing Model">
        <v-col>
          <v-select
            :items="['Not Charged', 'Normal', 'Balanced/Unbalanced']"
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
      <div v-if="service.pricingModel === 'Normal'">
        <row label="Rate">
          <rating-plan-input v-model="service.rate" />
        </row>
      </div>
      <div v-if="service.pricingModel === 'Balanced/Unbalanced'">
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
      <row label="Access Pricing Model">
        <v-col>
          <v-select
            :items="['Not Charged', 'Normal']"
            placeholder="Select Model"
            v-model="service.accessPricingModel"
          />
        </v-col>
      </row>
      <div v-if="service.accessPricingModel !== 'Not Charged'">
        <row label="Unit">
          <v-col>
            <v-text-field
              v-model="service.accessPricingUnit"
              placeholder="Access unit to charge"
            />
          </v-col>
        </row>
      </div>
      <div v-if="service.accessPricingModel === 'Normal'">
        <row label="Rate">
          <rating-plan-input v-model="service.accessPricingRate" />
        </row>
      </div>
    </fragment>
  </v-col>
</template>
<script>
import {mapState} from 'vuex';
import {duplicateMixin} from '../../../../utils/mixins/component-specfic';
import RatingPlanInput from './discount-form-components/RatingPlanInput';

export default {
  name: 'service-group-form',
  description: 'description',
  mixins: [duplicateMixin],
  props: ['homeTadigOptions', 'visitorTadigOptions', 'value'],
  components: {
    RatingPlanInput,
  },
  data() {
    return {
      homeTadigs: [],
      visitorTadigs: [],
      chosenServices: [
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
        },
      ],
    };
  },
  watch: {
    chosenServices: {
      handler() {
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
      });
    },
    removeService(index) {
      this.chosenServices.splice(index, 1);
    },
  },
  computed: {
    ...mapState(['services']),
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
        },
      ];
    }
  },
};
</script>
