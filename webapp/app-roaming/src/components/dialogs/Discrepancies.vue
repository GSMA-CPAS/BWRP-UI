<template>
  <app-dialog width="80vw" title="View discrepancies" label="Discrepancies">
    <template #content>
      <v-data-table :headers="headers" :items="filteredDiscrepancies">
        <template v-slot:top>
          <filters :on-clear="clearFilters">
            <template #body="{distinct}">
              <v-col v-for="({label},key) in filters" :key="label">
                <v-select
                  clearable
                  v-model="filters[key].value"
                  multiple
                  :items="distinct(filteredDiscrepancies,label)"
                  :label="label"
                />
              </v-col>
              <v-col>
                <range v-model="range" :values="values" label="Difference" />
              </v-col>
            </template>
          </filters>
        </template>
      </v-data-table>
    </template>
  </app-dialog>
</template>
<script>
import Filters from "../other/Filters.vue";
import Range from "../other/Range.vue";
export default {
  components: {
    Range,
    Filters,
  },
  name: "create-contract",
  description: "This is the dialog to view the discrepancies.",
  props: {},
  data: () => ({
    range: { from: null, to: null },
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
    values() {
      return this.discrepancies.map(({ difference }) => difference);
    },
    filteredDiscrepancies() {
      return this.discrepancies.filter((discrepancy) => {
        const filters = this.filters.filter(
          (filter) => filter.value.length > 0
        );
        var valid = filters.every(({ label, value }) =>
          value.includes(discrepancy[this._.camelCase(label)])
        );
        const { from, to } = this.range;
        const parsedFrom = parseFloat(from),
          parsedTo = parseFloat(to);
        const difference = discrepancy.difference;
        if (
          (parsedFrom < 0 && parsedFrom > difference) ||
          (parsedFrom < 0 && parsedFrom > difference) ||
          (parsedTo < 0 && parsedTo < difference) ||
          (parsedTo > 0 && parsedTo > difference)
        ) {
          valid = false;
        }
        return valid;
      });
    },
  },
  mixins: [],
  methods: {
    clearFilters() {
      this.filters.forEach((filter) => (filter.value = []));
      this.range.from = null;
      this.range.to = null;
    },
  },
};
</script>