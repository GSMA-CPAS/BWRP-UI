<template>
  <div>
    <v-row>
      <v-col>
        <row no-divider label="Name">{{
          documentData.metadata.name | isNil
        }}</row>
      </v-col>
      <v-col>
        <row no-divider label="Type">{{
          documentData.metadata.type | isNil
        }}</row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row no-divider label="Start Date">
          {{ documentData.framework.term.start | parseDate }}
        </row>
      </v-col>
      <v-col>
        <row no-divider label="End Date">
          {{ documentData.framework.term.end | parseDate }}
        </row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row no-divider label="Prolongation Length">
          <div v-if="documentData.framework.term.prolongation > 0">
            {{ `${documentData.framework.term.prolongation} months` }}
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
          <div v-if="documentData.framework.payment.taxesIncluded">
            Included
          </div>
          <div v-else>Excluded</div>
        </row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row label="Authors" no-divider>
          <div>{{ documentData.metadata.authors | isNil }}</div>
        </row>
      </v-col>
      <v-col />
    </v-row>
    <v-divider></v-divider>
    <row type="secondary" label="Additional Information" />
    <v-divider></v-divider>
    <parties-header />
    <row label="Currency for all discounts">
      <v-col>
        {{
          documentData.framework.partyInformation[selfMsp].contractCurrency
            | isNil
        }}
      </v-col>
      <v-divider vertical />
      <v-col>
        {{
          documentData.framework.partyInformation[partnerMsp].contractCurrency
            | isNil
        }}
      </v-col>
    </row>
    <row label="TADIG Codes">
      <v-col>
        <div>
          {{ tadigCodesSelf | isNil }}
        </div>
        <template
          v-if="
            documentData.framework.partyInformation[selfMsp]
              .includeContractParty
          "
        >
          Include contract party
          <v-icon color="primary"> mdi-checkbox-marked-outline </v-icon>
        </template>
      </v-col>
      <v-divider vertical />
      <v-col v-if="documentData.framework.partyInformation">
        <div>
          {{ tadigCodesPartner | isNil }}
        </div>
        <template
          v-if="
            documentData.framework.partyInformation[selfMsp]
              .includeContractParty
          "
        >
          Include contract party
          <v-icon color="primary"> mdi-checkbox-marked-outline </v-icon>
        </template>
      </v-col>
    </row>
    <row label="Required Signatures (minimum)">
      <v-col>
        <div>
          {{ headerData.msps[selfMsp].minSignatures | isNil }}
        </div>
      </v-col>
      <v-divider vertical />
      <v-col>
        <div>
          {{ headerData.msps[partnerMsp].minSignatures | isNil }}
        </div>
      </v-col>
    </row>
  </div>
</template>
<script>
import HelpTooltip from '@components/HelpTooltip.vue';
import {timelineMixin} from '@mixins/component-specfic';
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
  computed: {
    tadigCodesSelf() {
      const tadigCodesSelf = this.documentData.framework.partyInformation[
        this.selfMsp
      ].defaultTadigCodes;
      return tadigCodesSelf instanceof Array ? tadigCodesSelf.join(', ') : null;
    },
    tadigCodesPartner() {
      const tadigCodesPartner = this.documentData.framework.partyInformation[
        this.partnerMsp
      ].defaultTadigCodes;
      return tadigCodesPartner instanceof Array
        ? tadigCodesPartner.join(', ')
        : null;
    },
  },
};
</script>
