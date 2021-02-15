<template>
  <fragment>
    <v-row
      v-if="type === 'primary'"
      class="primary--text text-uppercase font-weight-medium"
    >
      <v-col :class="labelExtraClasses">
        {{ label }}
      </v-col>
    </v-row>
    <div
      v-else-if="type === 'secondary'"
      class="font-weight-medium h1 mt-2 mb-2"
    >
      {{ label }}
    </div>
    <v-row v-else align="baseline">
      <v-col :cols="cols" class="font-weight-medium">{{ label }}</v-col>
      <v-divider v-if="!noDivider" vertical></v-divider>
      <slot />
    </v-row>
  </fragment>
</template>
<script>
export default {
  name: 'row',
  description: 'This is a custom row',
  props: {
    label: {type: String, default: 'Missing Row Label'},
    labelExtraClasses: String,
    type: String,
    cols: {type: String, default: '3'},
    noDivider: Boolean,
    fillerCol: Boolean,
  },
};
</script>
