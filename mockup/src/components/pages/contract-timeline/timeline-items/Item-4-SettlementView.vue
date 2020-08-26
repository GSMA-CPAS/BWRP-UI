<template>
  <v-card class="ml-12" color="#fafafa">
    <v-card-text>
      <div>DATA UPLOADED...</div>
      <br />
      <div>
        ...by {Party} at {date}
        <v-icon color="success">mdi-check-circle-outline</v-icon>
      </div>
      <div>
        ...by {Party} at {date}
        <v-icon color="success">mdi-check-circle-outline</v-icon>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <settlement />
    </v-card-actions>
  </v-card>
</template>
<script>
import Settlement from "../../../dialogs/Settlement.vue";
import UploadSettlementVue from "../../../dialogs/UploadSettlement.vue";
export default {
  name: "item-1",
  description: "description",
  button: UploadSettlementVue,
  mixins: [],
  data() {
    return {};
  },
  components: {
    Settlement,
  },
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>