<template>
  <v-footer outlined>
    <v-spacer />
    <div>{{ version }}</div>
  </v-footer>
</template>
<script>
import {appDetailsMixin} from '@mixins/component-specfic';
export default {
  name: 'app-footer',
  description:
    'This component represents the footer of the app and contains the current version.',
  mixins: [appDetailsMixin],
  data: () => ({}),
  components: {},
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>
