
<template>
  <v-data-table :items="documents" :headers="headers" :search="search">
    <template v-slot:top>
      <v-row>
        <v-col>
          <filters :onClear="clearFilters"> </filters>
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
      <tr @click="to(item.documentId)" @keypress.enter="to(item.documentId)" tabindex="0">
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
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from "vuex";
import Filters from "@/components/other/Filters.vue";
export default {
  name: "contracts-table",
  description: "In this table, the documents are displayed.",
  data() {
    return {
      search: "",
      headers: [
        { text: "Document ID", value: "documentId", align: "start" },
        { text: "fromMSP", value: "fromMSP" },
        { text: "toMSP", value: "toMSP" },
      ],
    };
  },
  components: {
    Filters,
  },
  methods: {
    clearFilters() {
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
  },
};
</script>