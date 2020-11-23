<template>
  <v-expansion-panels hover flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="primary--text">
        ADVANCED FILTERS
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <slot name="body" :distinct="distinct" />
        </v-row>
        <v-row v-if="onClear" justify="center">
          <app-button
            outlined
            label="Reset Filters"
            @button-pressed="onClear"
          />
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: 'filters',
  description: 'This component is used to filter documents or settlements.',
  props: {onClear: Function},
  methods: {
    distinct(values, key) {
      return [...new Set(values.map((x) => x[this._.camelCase(key)]))];
    },
  },
};
</script>
