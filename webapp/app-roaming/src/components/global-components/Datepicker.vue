<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
  >
    <template v-slot:activator="{on}">
      <v-text-field
        :error-messages="requiredError(key)"
        v-bind="$props"
        v-model="date"
        prepend-icon="mdi-calendar"
        :disabled="disabled"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker
      :min="minDate"
      ref="picker"
      color="secondary"
      v-model="date"
      :max="maxDate"
      :show-current="false"
      scrollable
    />
  </v-menu>
</template>
<script>
import moment from 'moment';
import {validationMixin} from '@mixins/component-specfic';
export default {
  name: 'date-picker',
  description: 'This is a custom date picker.',
  inject: ['$v'],
  data() {
    return {menu: false};
  },
  mixins: [validationMixin],
  props: {
    label: {type: String, default: 'Date Picker'},
    min: {type: Date, default: null},
    max: {type: Date, default: null},
    value: Date,
    disabled: Boolean,
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'));
    },
  },
  methods: {
    isoDate(input) {
      const date = input || moment().add(1, 'months')._d;
      return date.toISOString().substr(0, 10);
    },
  },
  computed: {
    key() {
      return this._.camelCase(this.label);
    },
    date: {
      get() {
        return this.value && this.isoDate(this.value);
      },
      set(newValue) {
        this.$refs.menu.save(newValue);
        this.$emit('input', new Date(newValue));
      },
    },
    maxDate() {
      return this.isoDate(this.max || moment().add(10, 'years')._d);
    },
    minDate() {
      return this.min
        ? this.isoDate(moment(this.min).add(1, 'months')._d)
        : null;
    },
  },
};
</script>
