<template>
  <v-col>
    <fragment v-for="(tier, index) in (disableThresholds ? tiers.slice(0,1) : tiers)" :key="tier.id">
      <v-row>
        <v-col v-if="!disableThresholds">
          <v-currency-field
            :disabled="index === 0"
            v-model="tier.threshold"
            label="Threshold"
          />
        </v-col>
        <v-col v-if="!disableFixed">
          <v-currency-field v-model="tier.fixedPrice" label="Fixed Price" />
        </v-col>
        <v-col v-if="!disableLinear">
          <v-currency-field v-model="tier.linearPrice" label="Linear Price" />
        </v-col>
        <v-col
          align-self="center"
          class="mr-3"
          cols="1"
          v-if="!disableThresholds"
        >
          <v-icon
            :disabled="isDisabled || index === 0"
            @click="removeTier(index)"
          >
            {{ `mdi-${icons.remove}` }}
          </v-icon>
        </v-col>
        <v-col
          align-self="center"
          class="mr-3"
          cols="1"
          v-if="!disableThresholds"
        >
          <v-icon :disabled="disableThresholds" @click="addTier">
            {{ `mdi-${icons.add}` }}
          </v-icon>
        </v-col>
      </v-row>
    </fragment>
  </v-col>
</template>
<script>
import {duplicateMixin} from '@/utils/mixins/component-specfic';
/* import DiscountPicker from "./discount-form-components/DiscountPicker.vue";
import OverallRevenueCommitment from "./discount-form-components/OverallRevenueCommitment.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";
import CurrencyForAllDiscounts from "./discount-form-components/CurrencyForAllDiscounts.vue";
import TadigCodes from "./discount-form-components/TadigCodes.vue";
import AdditionalComments from "./discount-form-components/AdditionalComments.vue";*/
export default {
  name: 'rating-plan-input',
  description: 'description',
  mixins: [duplicateMixin],
  components: {
    /* AdditionalComments,
    TadigCodes,
    CurrencyForAllDiscounts,
    OverallRevenueCommitment,
    DiscountPicker,*/
  },
  props: ['value', 'disableThresholds', 'disableFixed', 'disableLinear'],
  data() {
    return {
      tiers: [
        {
          id: 'tier-0',
          threshold: 0,
        },
      ],
    };
  },
  watch: {
    tiers: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
  methods: {
    addTier() {
      this.tiers.push({
        id: `tier-${this.tiers.length}`,
        name: null,
      });
    },
    removeTier(index) {
      this.tiers.splice(index, 1);
    },
  },
  computed: {
    isDisabled() {
      return this.tiers.length === 1;
    },
  },
  beforeMount() {
    if (this.value) {
      this.tiers = this.value;
    }
  },
};
</script>
