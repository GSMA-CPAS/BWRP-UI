<template>
  <fragment class="text-center">
    <v-row>
      <v-col>
        <row no-divider label="Name">{{name}}</row>
      </v-col>
      <v-col>
        <row no-divider label="Type">{{type}}</row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row no-divider label="Start Date">{{startDate | parseDate}}</row>
      </v-col>
      <v-col>
        <row no-divider label="End Date">{{endDate | parseDate}}</row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <row no-divider label="Prolongation Length">
          <div v-if="prolongationLength >0">
            {{`${prolongationLength} months`}}
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
import { mapState } from "vuex";
import HelpTooltip from "../../other/HelpTooltip.vue";
export default {
  name: "tab-1",
  label: "General Information",
  description: "description",
  components: {
    HelpTooltip,
  },
  computed: {
    ...mapState("contract", ["generalInformation"]),
  },
  beforeMount() {
    for (const key in this.generalInformation) {
      this[key] = this.generalInformation[key];
    }
  },
};
</script>