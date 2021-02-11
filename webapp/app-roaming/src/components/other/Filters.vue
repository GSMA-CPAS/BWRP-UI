<template>
  <v-expansion-panels hover flat>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-row dense>
          <v-col>More Filters</v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row dense>
          <v-col>
            <v-combobox
              @input="onTadigSelect"
              v-model="includeTadigs"
              clearable
              multiple
              label="Include TADIGs"
              :items="availableTadigs"
            />
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: 'filters',
  description: 'This component is used to filter documents or settlements.',
  data: () => ({includeTadigs: []}),
  props: {
    documents: {type: Array, required: true},
  },
  methods: {
    onTadigSelect(selected) {
      const tadigs = this._.intersection(this.availableTadigs, selected);
      if (tadigs.length > 0) {
        this.$emit('on-select', {type: 'tadig-select', data: tadigs});
      } else {
        this.$emit('on-remove', 'tadig-select');
      }
    },
    distinct(values, key) {
      return [...new Set(values.map((x) => x[this._.camelCase(key)]))];
    },
  },
  computed: {
    availableTadigs() {
      return this.documents.reduce((arr, curVal) => {
        return this._.union(arr, curVal.tadigCodes);
      }, []);
    },
  },
};
</script>
