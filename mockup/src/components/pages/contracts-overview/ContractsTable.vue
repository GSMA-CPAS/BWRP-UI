<template>
  <v-data-table :items="metadata" :headers="headers">
    <template v-slot:top></template>
    <template #item="{ item }">
      <tr @click="to(item._cid)">
        <td class="pa-6">{{ item.name }}</td>
        <td>{{ item.partner }}</td>
        <td>{{ item.lastModification | parseDate }}</td>
        <td>{{ item.netPosition | isNil }}{{item.netPosition && '€'}}</td>
        <td>{{ item.status }}</td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "contracts-table",
  description: "In this table, the contracts are shown.",
  mixins: [],
  data() {
    return {
      headers: [
        { text: "Name", value: "name", align: "start" },
        { text: "Partner", value: "partner" },
        { text: "Last Modification", value: "lastModification" },
        { text: "Net Position", value: "netPosition" },
        { text: "Status", value: "status" },
      ],
    };
  },
  components: {},
  props: {},
  watch: {},
  methods: {
    to(cid) {
      this.$router.push(`/contract-timeline/${cid}`);
    },
  },
  computed: { ...mapState(["metadata"]) },
  mounted() {},
};
</script>