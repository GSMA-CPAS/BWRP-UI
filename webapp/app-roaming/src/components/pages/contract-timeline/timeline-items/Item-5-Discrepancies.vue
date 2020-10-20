<template>
  <timeline-item>
    <template #content>
      <v-card color="#fafafa">
        <v-card-text>DISCREPANCIES CALCULATED</v-card-text>
        <v-card-actions>
          <v-spacer />
          <discrepancies />
        </v-card-actions>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import { mapGetters } from "vuex";
import Discrepancies from "../../../dialogs/Discrepancies.vue";
export default {
  name: "item-1",
  description: "description",
  mixins: [],
  data() {
    return { discrepanciesComputed: false };
  },
  components: { Discrepancies },
  props: {},
  watch: {},
  methods: {},
  computed: { ...mapGetters("document", ["exists"]) },
  mounted() {},
};
</script>