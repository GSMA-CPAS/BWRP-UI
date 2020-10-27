<template>
  <v-icon :color="color">{{ `mdi-${icon}-circle-outline` }}</v-icon>
</template>
<script>
export default {
  name: "progress-icon",
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: { state: { type: String, default: "error" } },
  watch: {},
  methods: {},
  computed: {
    color() {
      return this.state;
    },
    icon() {
      switch (this.state) {
        case "error":
          return "close";
        case "progress":
          return "minus";
        case "success":
          return "check";
        default:
          return "close-circle-outline";
      }
    },
  },
  mounted() {},
};
</script>