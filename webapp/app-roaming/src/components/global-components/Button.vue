<template>
  <v-btn v-on="$listeners" v-bind="$props" @click="handleClick">
    {{ label }}
    <v-icon :size="iconSize" v-if="svg" :color="color" :right="!_.isNil(label)">
      {{ 'mdi-' + svg }}
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'app-button',
  description: 'Custom vuetify button to add more flexibility',
  props: {
    to: String,
    label: String,
    icon: {
      type: Boolean,
      default: false,
    },
    height: String,
    width: String,
    minWidth: {type: String, default: '180'},
    iconSize: String,
    loading: {
      type: Boolean,
      default: false,
    },
    svg: String,
    block: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  ripple: {
      type: Boolean,
      default: true,
    },
    fab: {
      type: Boolean,
      default: false,
    },
    depressed: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    xLarge: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('button-pressed', e);
    },
  },
};
</script>
