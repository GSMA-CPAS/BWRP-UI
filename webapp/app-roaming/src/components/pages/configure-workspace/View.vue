<template>
  <component :is="component"></component>
</template>
<script>
export default {
  name: 'workspace-view',
  title: 'Workspace',
  description: 'Displays current picked menu',
  mixins: [],
  data: () => ({}),
  components: {},
  props: {menu: {type: String}},
  watch: {},
  methods: {},
  computed: {
    component() {
      const menus = require.context('./menus', false, /.*.(vue|js)$/);
      return menus(`./${this.menu}.vue`).default;
    },
  },
  mounted() {},
};
</script>
