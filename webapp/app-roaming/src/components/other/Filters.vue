<template>
  <v-expansion-panels hover flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="primary--text">ADVANCED FILTERS</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <slot name="body" :distinct="distinct" />
        </v-row>
        <v-row v-if="onClear" justify="center">
          <app-button outlined label="Reset Filters" @button-pressed="onClear"></app-button>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: "filters",
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: {},
  props: { onClear: Function },
  watch: {},
  methods: {
    distinct(values, key) {
      return [...new Set(values.map((x) => x[this._.camelCase(key)]))];
    },
  },
  computed: {},
  mounted() {},
};
</script>