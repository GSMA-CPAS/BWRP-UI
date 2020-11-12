<template>
  <fragment>
    <v-row
      v-if="type === 'primary'"
      class="primary--text text-uppercase font-weight-medium pa-2"
    >
      {{ label }}
    </v-row>
    <div
      v-else-if="type === 'secondary'"
      class="secondary--text font-weight-medium h1 pa-1"
    >
      {{ label }}
    </div>
    <v-row v-else align="baseline">
      <v-col :cols="cols" class="font-weight-medium">{{ label }}</v-col>
      <v-divider class="mr-2" v-if="!noDivider" vertical></v-divider>
      <slot />
    </v-row>
  </fragment>
</template>
<script>
export default {
  name: "row",
  description: "This is a custom row",
  props: {
    label: { type: String, default: "Missing Row Label" },
    type: String,
    cols: { type: String, default: "3" },
    noDivider: Boolean,
  },
};
</script>