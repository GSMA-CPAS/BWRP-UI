
<template>
  <v-data-table :items="documents" :headers="headers" :search="search">
    <template v-slot:top>
      <v-row>
        <v-col>
          <filters :onClear="clearFilters">
            <!-- <template #body="{ distinct }"> -->
            <!-- <v-row align="baseline">
                <v-col v-for="({ label }, key) in selectFilters" :key="label">
                  <v-select
                    clearable
                    v-model="selectFilters[key].value"
                    multiple
                    :items="distinct(documents, label)"
                    :label="label"
                  />
                </v-col>
                        <v-col>
                  <range
                    v-model="range"
                    :values="netPositions"
                    label="Net Position"
                  />
                </v-col>
              </v-row> -->
            <!-- </template> -->
          </filters>
        </v-col>
        <v-col cols="5">
          <v-text-field
            outlined
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Contract"
            single-line
            hide-details
          />
        </v-col>
      </v-row>
    </template>
    <template #item="{ item }">
      <tr @click="to(item.documentId)">
        <td class="pa-6">
          {{
            `${item.documentId.substring(0, 5)}...${item.documentId.substring(
              item.documentId.length - 5,
              item.documentId.length
            )}`
          }}
        </td>
        <td>{{ item.fromMSP }}</td>
        <td>{{ item.toMSP }}</td>
        <!--<td>{{ item.timeStamp | parseDate }}</td>-->
        <!--        <td>{{ item.netPosition | isNil }}{{ item.netPosition && "€" }}</td>
        <td>{{ item.status }}</td> -->
      </tr>
    </template>
  </v-data-table>
</template>
<script>
/* eslint-disable vue/no-unused-components */
import { mapState } from "vuex";
import Filters from "../../other/Filters.vue";
import Range from "../../other/Range.vue";
export default {
  name: "contracts-table",
  description: "In this table, the contracts are shown.",
  mixins: [],
  data() {
    return {
      /*   range: { from: null, to: null }, */
      selectFilters: [
        {
          label: "toMSP",
          value: [],
        },
        /* {
          label: "Status",
          value: [],
        }, */
      ],
      search: "",
      headers: [
        { text: "Document ID", value: "documentId", align: "start" },
        { text: "fromMSP", value: "fromMSP" },
        { text: "toMSP", value: "toMSP" },
        /*{ text: "Last Modification", value: "timeStamp" },*/
        /*  { text: "Net Position", value: "netPosition" }, */
        /*     { text: "Status", value: "status" }, */
      ],
    };
  },
  components: {
    Range,
    Filters,
  },
  props: {},
  watch: {},
  methods: {
    clearFilters() {
      this.range.from = null;
      this.range.to = null;
      this.selectFilters.forEach((filter) => {
        filter.value = [];
      });
    },
    to(cid) {
      this.$router.push(`/contract-timeline/${cid}`);
    },
  },
  computed: {
    ...mapState(["documents"]),
    /* netPositions() {
      return this.metadata.map(({ netPosition }) => netPosition);
    }, */
    /*  filteredMetadata() {
      return this.metadata.filter((contract) => {
        const { netPosition } = contract;
        const { from, to } = this.range;
        const filters = this.selectFilters.filter(
          (filter) => filter.value.length > 0
        );
        var valid = filters.every(({ label, value }) =>
          value.includes(contract[this._.camelCase(label)])
        );

        if (parseInt(from) > netPosition || parseInt(to) < netPosition) {
          valid = false;
        }

        return valid;
      });
    }, */
  },
};
</script>