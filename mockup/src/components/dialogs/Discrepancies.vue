<template>
  <app-dialog width="80vw" title="View discrepancies" label="Discrepancies">
    <template #content>
      <v-data-table :headers="headers" :items="filteredDiscrepancies">
        <template v-slot:top>
          <v-expansion-panels hover flat>
            <v-expansion-panel>
              <v-expansion-panel-header class="primary--text">FILTERS</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col v-for="({label},key) in filters" :key="label">
                    <v-select
                      clearable
                      v-model="filters[key].value"
                      multiple
                      :items="distinct(label)"
                      :label="label"
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      clearable
                      v-model="differenceFilter.value"
                      :items="differenceFilter.items"
                      :label="differenceFilter.label"
                    />
                  </v-col>
                </v-row>
                <!-- 
                  TODO: future feature?
                  <v-row>
                  <v-spacer></v-spacer>
                  <app-button label="Clear all Filters"></app-button>
                </v-row>-->
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </v-data-table>
    </template>
  </app-dialog>
</template>
<script>
export default {
  name: "create-contract",
  description: "This is the dialog to view the discrepancies.",
  props: {},
  data: () => ({
    filters: [
      {
        label: "HPMN",
        value: [],
      },
      {
        label: "VPMN",
        value: [],
      },
      {
        label: "Month",
        value: [],
      },
      {
        label: "Service",
        value: [],
      },
    ],
    differenceFilter: {
      label: "Difference",
      items: ["<20000", "≥ 20000"],
      value: [],
    },
    headers: [
      {
        text: "HPMN",
        value: "hpmn",
        align: "start",
      },
      { text: "VPMN", value: "vpmn" },
      { text: "MONTH", value: "month" },
      { text: "SERVICE", value: "service" },
      { text: "USAGE by BP", value: "usageBP" },
      { text: "USAGE by DT", value: "usageSelf" },
      { text: "CHARGES by BP", value: "chargesBP" },
      { text: "CHARGES by DT", value: "chargesSelf" },
      { text: "DIFFERENCE", value: "difference" },
    ],
    discrepancies: [
      {
        hpmn: "DEUV2",
        vpmn: "ESPV1",
        month: "01.18",
        service: "MOC OTHER",
        usageBP: 105,
        usageSelf: 105,
        chargesSelf: 12,
        chargesBP: 12.04,
        difference: -0.04,
      },
      {
        hpmn: "DEUV2",
        vpmn: "ESPV1",
        month: "01.18",
        service: "MOC Local",
        usageBP: 16,
        usageSelf: 16,
        chargesSelf: 0.9,
        chargesBP: 1,
        difference: -0.1,
      },
    ],
  }),
  computed: {
    filteredDiscrepancies() {
      return this.discrepancies.filter((discrepancy) => {
        const filters = this.filters.filter(
          (filter) => filter.value.length > 0
        );
        var valid = filters.every(({ label, value }) =>
          value.includes(discrepancy[this._.camelCase(label)])
        );
        var test = true;
        const difference = this.differenceFilter.value;
        switch (difference) {
          case "<20000":
            test = discrepancy.difference < 20000;
            break;
          case "≥ 20000":
            test = discrepancy.difference >= 20000;
            break;
          default:
            break;
        }
        return test && valid;
      });
    },
  },
  mixins: [],
  methods: {
    distinct(value) {
      return [
        ...new Set(this.discrepancies.map((x) => x[this._.camelCase(value)])),
      ];
    },
  },
};
</script>