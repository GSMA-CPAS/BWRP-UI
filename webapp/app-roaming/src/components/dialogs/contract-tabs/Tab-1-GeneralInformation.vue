<template>
  <fragment class="text-center">
    <v-row>
      <v-col>
        <row no-divider label="Name">{{ generalInformation.name | isNil }}</row>
      </v-col>
      <v-col>
        <row no-divider label="Type">{{ generalInformation.type | isNil }}</row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row no-divider label="Start Date">
          {{ generalInformation.startDate | parseDate }}
        </row>
      </v-col>
      <v-col>
        <row no-divider label="End Date">
          {{ generalInformation.endDate | parseDate }}
        </row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row no-divider label="Prolongation Length">
          <div v-if="generalInformation.prolongationLength > 0">
            {{ `${generalInformation.prolongationLength} months` }}
            <help-tooltip
              icon="message-alert-outline"
              text="This contract will renew automatically"
            />
          </div>
          <div v-else>N/A</div>
        </row>
      </v-col>
      <v-col>
        <row no-divider label="Taxes">
          <div v-if="generalInformation.taxesIncluded">Included</div>
          <div v-else>Excluded</div>
        </row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row label="Authors" no-divider>
          <v-col>{{ generalInformation.authors | isNil }}</v-col>
        </row>
      </v-col>
      <v-col />
    </v-row>
    <v-divider></v-divider>
    <row type="secondary" label="Additional Information"> </row>
    <v-divider></v-divider>
    <parties-header />
    <row label="Currency for all discounts">
      <v-col>
        {{ generalInformation[fromMSP].currencyForAllDiscounts | isNil }}
      </v-col>
      <v-divider vertical />
      <v-col>
        {{ generalInformation[toMSP].currencyForAllDiscounts | isNil }}
      </v-col>
    </row>
    <row label="TADIG Codes">
      <v-col>
        <div>
          {{ generalInformation[fromMSP].tadigCodes.codes | isNil }}
        </div>
        <template
          v-if="generalInformation[fromMSP].tadigCodes.includeContractParty"
        >
          Include contract party
          <v-icon color="primary"> mdi-checkbox-marked-outline </v-icon>
        </template>
      </v-col>
      <v-divider vertical />
      <v-col>
        <div>
          {{ generalInformation[toMSP].tadigCodes.codes | isNil }}
        </div>
        <template
          v-if="generalInformation[toMSP].tadigCodes.includeContractParty"
        >
          Include contract party
          <v-icon color="primary"> mdi-checkbox-marked-outline </v-icon>
        </template>
      </v-col>
    </row>
  </fragment>
</template>
<script>
import HelpTooltip from '@/components/other/HelpTooltip.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
import PartiesHeader from '../components/PartiesHeader.vue';
export default {
  name: 'tab-1',
  label: 'General Information',
  description:
    'In this tab the general information of a contract is displayed. The tab is found in the contract timeline when clicking on "View Contract"',
  components: {
    HelpTooltip,
    PartiesHeader,
  },
  mixins: [timelineMixin],
};
</script>
