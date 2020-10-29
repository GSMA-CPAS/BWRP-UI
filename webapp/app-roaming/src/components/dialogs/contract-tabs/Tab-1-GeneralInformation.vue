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
        <row no-divider label="Start Date">{{
          generalInformation.startDate | parseDate
        }}</row>
      </v-col>
      <v-col>
        <row no-divider label="End Date">{{
          generalInformation.endDate | parseDate
        }}</row>
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
      <v-col></v-col>
    </v-row>
  </fragment>
</template>
<script>
import HelpTooltip from "@/components/other/HelpTooltip.vue";
import { timelineMixin } from "@/utils/mixins/component-specfic";
export default {
  name: "tab-1",
  label: "General Information",
  description:
    "In this tab the general information of a contract is displayed. The tab is found in the contract timeline when clicking on 'View Contract'",
  components: {
    HelpTooltip,
  },
  mixins: [timelineMixin],
};
</script>