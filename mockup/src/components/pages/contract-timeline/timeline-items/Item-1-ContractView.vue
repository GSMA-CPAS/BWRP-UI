<template >
  <v-card color="#fafafa">
    <v-card-text>CREATED at {date} by {party}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <contract />
    </v-card-actions>
  </v-card>
</template>
<script>
import Contract from "../../../dialogs/Contract.vue";
export default {
  name: "item-1",
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: { Contract },
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>