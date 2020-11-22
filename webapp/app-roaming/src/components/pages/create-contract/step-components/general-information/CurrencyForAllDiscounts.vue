<template>
  <currency-selector v-model="currency" />
</template>
<script>
export default {
  name: "currency-for-all-discounts",
  description: "description",
  props: {
    value: String,
  },
  computed: {
    currency: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>