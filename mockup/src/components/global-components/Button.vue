<template>
  <v-btn v-on="$listeners" v-bind="$props" @click="handleClick">
    {{ label }}
    <v-icon v-if="svg" :color="color" :right="!_.isNil(label)">{{ "mdi-" + svg }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "app-button",
  description: "Custom Vuetify Button. View Mixin for more details",
  props: {
    to: String,
    label: String,
    icon: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    svg: String,
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fab: {
      type: Boolean,
      default: false
    },
    depressed: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "primary"
    },
    small: {
      type: Boolean,
      default: false
    },
    xSmall: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(e) {
      this.$emit("button-pressed", e);
    }
  }
};
</script>