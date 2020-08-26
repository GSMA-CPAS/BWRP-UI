// TODO: Move to contract-tabs folder if needed in the future
<template>
  <fragment>{{taps}}</fragment>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "tab-5",
  label: "TAPs",
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: {},
  watch: {},
  methods: {},
  computed: { ...mapState("contract", ["taps"]) },
  mounted() {},
};
</script>