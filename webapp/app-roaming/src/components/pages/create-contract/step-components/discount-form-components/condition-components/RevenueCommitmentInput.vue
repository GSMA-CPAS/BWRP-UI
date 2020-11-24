<template>
  <v-row>
      <v-col>
        <v-text-field v-model="value" label="Value"/>
      </v-col>
      <v-col>
        <v-text-field v-model="currency" label="Currency"/>
      </v-col>
      <v-col>
        <v-checkbox label="Including Taxes?" v-model="includingTaxes"/>
      </v-col>
    </v-row>
</template>
<script>
export default {
  name: "revenue-commitment-input",
  description: "description",
  data() {
    return {
      includingTaxes: false,
      value: null,
      currency: null,
    }
  },
  watch: {
    includingTaxes: {
      handler() {
        this.$emit("input", this.$data);
      },
      deep: true,
    },
    value: {
      handler() {
        this.$emit("input", this.$data);
      },
      deep: true,
    },
    currency: {
      handler() {
        this.$emit("input", this.$data);
      },
      deep: true,
    },
  }
};
</script>