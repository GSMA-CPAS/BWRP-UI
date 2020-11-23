<template>
  <v-row dense class="range-container">
    <div v-if="label" class="range-label" :class="{'primary--text': focused}">
      {{ label }}
    </div>
    <v-col cols="4">
      <v-text-field
        v-on="listeners"
        v-model="range.from"
        @input="handleInput"
        label="from"
      ></v-text-field>
    </v-col>
    <v-col align-self="center" class="range-seperator" cols="1">
      <hr />
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-on="listeners"
        v-model="range.to"
        label="to"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'range',
  description: 'Range component.',
  mixins: [],
  data() {
    return {
      focused: false,
      range: {from: null, to: null},
      min: null,
      max: null,
    };
  },
  components: {},
  props: {
    value: {type: Object},
    values: {type: Array},
    label: String,
  },
  watch: {
    range: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
  methods: {
    setExtremeties() {
      const range = this.values.reduce(
          (curRange, value) => {
            let {min, max} = curRange;
            (!min || !max) && ((min = value), (max = value));
            min > value && (min = value);

            max < value && (max = value);

            return {min, max};
          },
          {min: null, max: null},
      );
      this.range.from = range.min;
      this.range.to = range.max;
      this.min = range.min;
      this.max = range.max;
    },
    handleInput(newVal) {
      if (parseInt(newVal) > parseInt(this.to)) {
        this.to = newVal;
      }
    },
  },
  computed: {
    listeners() {
      return {
        focus: () => {
          this.focused = true;
        },
        blur: () => {
          this.focused = false;
        },
      };
    },
  },
  beforeMount() {
    if (this.values) {
      this.setExtremeties();
    }
  },
};
</script>
