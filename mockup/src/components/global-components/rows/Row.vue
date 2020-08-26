<template>
  <v-row align="baseline">
    <v-col :cols="cols" class="font-weight-medium">{{ label }}</v-col>
    <v-divider v-if="!noDivider" vertical></v-divider>
    <slot />
  </v-row>
</template>
<script>
export default {
  name: "row",
  description: "This is a custom row",
  props: {
    label: { type: String, default: "Missing Row Label" },
    cols: { type: String, default: "3" },
    noDivider: Boolean,
  },
};
</script>