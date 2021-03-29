<template>
  <div>
    <parties-header
      single
      :sub-row-labels="labels"
      v-on:party-switch="partySwitch"
    />
    <div
      v-for="(serviceGroup, sgIndex) in discountData.serviceGroups"
      :key="`party-${partyId}-sg-${sgIndex}`"
    >
      <row type="secondary" class="pa-4" :label="`Group ${sgIndex + 1}`" />
      <v-divider />
      <row cols="2" label="TADIGs">
        <v-col class="striped-column-container">
          <v-row>
            <v-col class="striped-column"><b>Home</b></v-col>
            <v-col class="striped-column">{{
              serviceGroup.homeTadigs && serviceGroup.homeTadigs.length > 0
                ? serviceGroup.homeTadigs.join(', ')
                : 'Default'
            }}</v-col>
            <v-col class="striped-column"></v-col>
            <v-col class="striped-column"></v-col>
            <v-col class="striped-column"></v-col>
            <v-col class="striped-column"></v-col>
          </v-row>
          <v-row>
            <v-col class="striped-column"><b>Visitor</b></v-col>
            <v-col class="striped-column">{{
              serviceGroup.visitorTadigs &&
              serviceGroup.visitorTadigs.length > 0
                ? serviceGroup.visitorTadigs.join(', ')
                : 'Default'
            }}</v-col>
            <v-col class="striped-column"></v-col>
            <v-col class="striped-column"></v-col>
            <v-col class="striped-column"></v-col>
            <v-col class="striped-column"></v-col>
          </v-row>
        </v-col>
      </row>
      <v-divider />
      <div
        v-for="(service, index) in serviceGroup.services"
        :key="`party-${partyId}-sg-${sgIndex}-row-${index}`"
      >
        <row cols="2" :label="service.service">
          <v-col class="striped-column-container">
            <template
              v-if="
                service.usagePricing && service.usagePricing.ratingPlan.rate
              "
            >
              <v-row>
                <simple-model-template
                  v-if="service.usagePricing.ratingPlan.kind === 'Linear rate'"
                  :data="service.usagePricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Usage"
                />
                <simple-model-template
                  v-if="service.usagePricing.ratingPlan.kind === 'Flat rate'"
                  :data="service.usagePricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Usage"
                />
                <tiered-model-template
                  v-if="
                    service.usagePricing.ratingPlan.kind ===
                    'Threshold - back to first'
                  "
                  :data="service.usagePricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Usage"
                />
                <tiered-model-template
                  v-if="
                    service.usagePricing.ratingPlan.kind ===
                    'Tiered with Thresholds'
                  "
                  :data="service.usagePricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Usage"
                />
                <balanced-unbalanced-model-template
                  v-if="
                    service.usagePricing.ratingPlan.kind ===
                    'Balanced/Unbalanced (Linear rate)'
                  "
                  :data="service.usagePricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Usage"
                />
              </v-row>
            </template>

            <template v-if="service.accessPricing">
              <v-row>
                <tiered-model-template
                  v-if="
                    service.accessPricing.ratingPlan.kind ===
                    'Threshold - back to first'
                  "
                  :data="service.accessPricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Access"
                />
                <tiered-model-template
                  v-if="
                    service.accessPricing.ratingPlan.kind ===
                    'Tiered with Thresholds'
                  "
                  :data="service.accessPricing"
                  :in-commitment="service.includedInCommitment"
                  model-type="Access"
                />
              </v-row>
            </template>
          </v-col>
        </row>
        <v-divider />
      </div>
    </div>
    <row type="secondary" class="pa-4" label="Other information" />
    <v-divider />
    <v-row align="baseline" class="text-center">
      <v-col cols="2" />
      <v-divider vertical></v-divider>
      <v-col>
        <v-row class="font-weight-medium">
          <v-col v-for="{label, key} in otherInformationLabels" :key="key">{{
            label
          }}</v-col>
        </v-row>
        <v-row>
          <v-col>{{
            documentData.framework.partyInformation[this.parties[this.partyId]]
              .contractCurrency
          }}</v-col>
          <v-col>{{ discountData.condition.kind }}</v-col>
          <v-col>{{
            discountData.condition.commitment
              ? discountData.condition.commitment.currency
              : ''
          }}</v-col>
          <v-col>{{
            discountData.condition.commitment
              ? discountData.condition.commitment.value
              : ''
          }}</v-col>
          <v-col
            ><v-icon
              v-if="
                discountData.condition.commitment &&
                discountData.condition.commitment.includingTaxes
              "
              color="primary"
            >
              mdi-checkbox-marked-outline
            </v-icon></v-col
          >
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import PartiesHeader from '../components/PartiesHeader.vue';
import {utilsMixin} from '@/utils/mixins/handle-data';
import {timelineMixin} from '@/utils/mixins/component-specfic';
import {mapGetters} from 'vuex';
import TieredModelTemplate from './models/TieredModelTemplate.vue';
import BalancedUnbalancedModelTemplate from './models/BalancedUnbalancedModelTemplate.vue';
import SimpleModelTemplate from './models/SimpleModelTemplate';
export default {
  name: 'tab-4',
  label: 'Discount Models',
  description:
    'In this tab the discount models of a contract are displayed. The tab is found in the contract timeline when clicking on "View Contract"',
  mixins: [utilsMixin, timelineMixin],
  components: {
    PartiesHeader,
    TieredModelTemplate,
    SimpleModelTemplate,
    BalancedUnbalancedModelTemplate,
  },
  data() {
    return {
      partyId: 0,
    };
  },
  methods: {
    partySwitch(partyId, party) {
      this.partyId = partyId;
    },
    renderModel(model) {
      if (model === undefined) {
        return;
      }

      let path = null;
      switch (model.ratingPlan.kind) {
        case 'Flat IOT':
          path = 'FlatIOT';
          break;
        case 'Baselines Incremental':
        case 'Baselines Non-Incremental':
          path = 'Baseline';
          break;
        default:
          path = this._.upperFirst(this._.camelCase(model.ratingPlan.kind));
      }
      const models = require.context(`./models/`, false, /.(vue)$/);
      return models(`./${path}.vue`).default;
    },
  },
  computed: {
    ...mapGetters('document', ['parties']),
    otherInformationLabels() {
      const otherInformationLabels = [
        'Currency for all Discounts',
        'Condition Type',
        'Condition Value',
        'Condition Currency',
        'Condition Includes Taxes?',
      ];
      return this.labelsToCamelCase(otherInformationLabels);
    },
    labels() {
      const discountModelsLabels = [
        'Type',
        'Unit/Tier',
        'Threshold',
        'Fixed Rate',
        'Linear Rate',
        'Revenue Commitment',
      ];
      return this.labelsToCamelCase(discountModelsLabels);
    },
    overallRevenueCommitment() {
      return {amount: 10000, currency: 'EUR'};
    },
    discountData() {
      return this.documentData.discounts[this.parties[this.partyId]];
    },
  },
};
</script>
