<template>
  <v-row class="primary--text text-uppercase font-weight-medium pa-3">{{label}}</v-row>
</template>
<script>
export default {
  name: "primary-row",
  description: "This is a custom primary row",
  props: { label: { type: String, default: "Missing Row Label" } },
};
</script>