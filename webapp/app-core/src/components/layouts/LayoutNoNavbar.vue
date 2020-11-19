<template>
  <v-main>
    <v-container fill-height fluid>
      <slot/>
    </v-container>
  </v-main>
</template>

<script>

export default {

  name: 'Layout',

  data() {
    return {};
  },

  props: {
    navbar: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },

  components: {},
};

</script>
