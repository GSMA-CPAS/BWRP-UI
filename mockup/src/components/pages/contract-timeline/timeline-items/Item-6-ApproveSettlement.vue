<template>
  <v-card class="ml-7" color="#fafafa">
    <v-card-text>
      <div>Approved...</div>
      <br />
      <div>
        ...awaiting from {Party}
        <v-icon color="error">mdi-close-circle-outline</v-icon>
      </div>
      <div>
        ...awaiting from {Party}
        <v-icon color="error">mdi-close-circle-outline</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import ApproveVue from "./buttons/Approve.vue";
export default {
  name: "item-1",
  button: ApproveVue,
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>