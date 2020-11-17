<template>
  <tooltip pos="right" :tooltip-text="text">
    <template #activator="{ on }">
      <v-icon :class="padding" v-bind="$props" v-on="on">{{
        `mdi-${icon}`
      }}</v-icon>
    </template>
  </tooltip>
</template>
<script>
export default {
  name: "help-tooltip",
  props: {
    text: { type: String, default: "Missing helper text" },
    padding: { type: String, default: "pb-6" },
    icon: { type: String, default: "help" },
    color: {
      type: String,
      default: "primary",
    },
    small: {
      type: Boolean,
      default: false,
    },
    xSmall: {
      type: Boolean,
    },
    large: Boolean,
  },
};
</script>