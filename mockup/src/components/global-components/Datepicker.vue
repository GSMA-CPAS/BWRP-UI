<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
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
      type="month"
      ref="picker"
      color="secondary"
      v-model="date"
      :max="maxDate"
      :min="minDate"
      :show-current="false"
      scrollable
    />
  </v-menu>
</template>
<script>
import moment from "moment";
import { validationMixin } from "../../utils/mixins/component-specfic";
export default {
  name: "date-picker",
  description: "This is custom date picker.",
  inject: ["$v"],
  data() {
    return { menu: false };
  },
  mixins: [validationMixin],
  props: {
    label: { type: String, default: "Date Picker" },
    min: { type: Date, default: null },
    max: { type: Date, default: null },
    value: Date,
    disabled: Boolean,
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "MONTH"));
    },
  },
  methods: {
    ISOStringDate(input) {
      const date = input || moment(new Date()).add(1, "months")._d;
      return date.toISOString().substr(0, 10);
    },
  },
  computed: {
    key() {
      return this._.camelCase(this.label);
    },
    date: {
      get: function () {
        return this.value && this.ISOStringDate(this.value);
      },
      set: function (newValue) {
        this.$refs.menu.save(newValue);
        this.$emit("input", new Date(newValue));
      },
    },
    maxDate() {
      return this.ISOStringDate(this.max || moment().add(10, "years")._d);
    },
    minDate() {
      return this.ISOStringDate(
        this.min && moment(this.min).add(1, "months")._d
      );
    },
  },
};
</script>