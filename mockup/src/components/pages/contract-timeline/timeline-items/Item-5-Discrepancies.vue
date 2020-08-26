<template>
  <v-card color="#fafafa">
    <v-card-text>DISCREPANCIES CALCULATED</v-card-text>
    <v-card-actions>
      <v-spacer />
      <discrepancies />
    </v-card-actions>
  </v-card>
</template>
<script>
import Discrepancies from "../../../dialogs/Discrepancies.vue";
export default {
  name: "item-1",
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: { Discrepancies },
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>