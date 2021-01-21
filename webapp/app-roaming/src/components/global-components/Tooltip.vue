<template>
  <v-tooltip v-bind="tooltipProps">
    <template #activator="{on}">
      <slot name="activator" :on="on" />
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>
<script>
export default {
  name: 'tooltip',
  description: 'This is a custom tooltip',
  props: {
    tooltipText: {type: String, default: 'Missing tooltip text'},
    pos: {type: String, default: 'bottom'},
  },
  computed: {
    tooltipProps() {
      const tooltipProps = {};
      tooltipProps[this.pos] = true;
      return tooltipProps;
    },
  },
};
</script>
