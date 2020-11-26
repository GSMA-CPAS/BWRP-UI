<template>
  <v-col>
    <row type="secondary" label="Condition"></row>
    <condition-picker v-model="condition"/>
    <v-row>
      <br><br>
    </v-row>
    <row type="secondary" label="Services"></row>
    <fragment v-for="(service, index ) in chosenServices" :key="service.id">
      <v-row>
        <v-col>
          <v-select
            v-model="service.name"
            :items="services"
            placeholder="Select Service"
          />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button
            :disabled="isDisabled"
            @button-pressed="removeService(index)"
            :svg="icons.remove"
            icon
          />
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button @button-pressed="addService" :svg="icons.add" icon />
        </v-col>
      </v-row>
      <row label="TADIGs">
        <v-col>
          <v-autocomplete v-model="service.tadigs" multiple :items="$props.tadigs" label="TADIGs" placeholder="All (Default)" />
        </v-col>
      </row>
      <row label="Usage Pricing Model">
        <v-col>
          <v-select
            :items="['Not Charged','Normal','Balanced/Unbalanced']"
            placeholder="Select Model"
            v-model="service.pricingModel"
          />
        </v-col>
      </row>
      <div v-if="service.pricingModel !== 'Not Charged'">
        <row label="Unit">
          <v-col>
            <v-text-field v-model="service.unit" placeholder="Minutes"/>
          </v-col>
        </row>
      </div>
      <div v-if="service.pricingModel === 'Normal'">
        <row  label="Rate">
          <rating-plan-input v-model="service.rate"/>
        </row>
      </div>
      <div v-if="service.pricingModel === 'Balanced/Unbalanced'">
        <row label="Balanced Rate">
          <rating-plan-input v-model="service.balancedRate"/>
        </row>
        <row label="Unbalanced Rate">
          <rating-plan-input v-model="service.unbalancedRate"/>
        </row>
      </div>
      <row label="Access Pricing Model">
        <v-col>
          <v-select
            :items="['Not Charged','Normal']"
            placeholder="Select Model"
            v-model="service.accessPricingModel"
          />
        </v-col>
      </row>
      <div v-if="service.accessPricingModel !== 'Not Charged'">
        <row label="Unit">
          <v-col>
            <v-text-field v-model="service.accessPricingUnit" placeholder="Minutes"/>
          </v-col>
        </row>
      </div>
      <div v-if="service.accessPricingModel === 'Normal'">
        <row  label="Rate">
          <rating-plan-input v-model="service.accessPricingRate"/>
        </row>
      </div>
    </fragment>
  </v-col>
</template>
<script>
import {mapState} from 'vuex';
import ConditionPicker from './discount-form-components/ConditionPicker';
import {duplicateMixin} from '../../../../utils/mixins/component-specfic';
import RatingPlanInput from './discount-form-components/RatingPlanInput';

export default {
  name: 'discount-form',
  description: 'description',
  mixins: [duplicateMixin],
  props: ['tadigs'],
  components: {
    RatingPlanInput,
    ConditionPicker
    /* AdditionalComments,
    TadigCodes,
    CurrencyForAllDiscounts,
    OverallRevenueCommitment,
    DiscountPicker,*/
  },
  data() {
    return {
      condition: null,
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
    }
  },
  computed: {
    ...mapState(['services']),
    isDisabled() {
      return this.chosenServices.length === 1;
    },
  },
};
</script>
